import { Subject, Subscription } from "rxjs";
import { DecodedPacket } from "types/packet/decoded-packet.interface";
import { IPacketsEmitter, SubscriberId } from "types/packets-emitter/packets-emitter.interface";


/**
 * Class that emits packets to the subscribers
 * @description The packets emitter is a class that emits packets to the subscribers
 * @template T - The type of the packet
 * @implements {IPacketsEmitter<T>} - The interface for the packets emitter
 */
export class PacketsEmitter implements IPacketsEmitter<DecodedPacket> {
    _subject: Subject<DecodedPacket>;
    _subscribers: Map<SubscriberId, Subscription>;

    constructor() {
        this._subject = new Subject<DecodedPacket>();
        this._subscribers = new Map();
    }

    /**
     * Emit a packet to the subscribers
     * @param packet - The packet to be emitted
     */
    emit(packet: DecodedPacket): void {
        this._subject.next(packet);
    }

    /**
     * Subscribe to the packets emitter
     * @param callback - The callback to be called when a packet is emitted
     * @returns The subscriber id
     */
    subscribe(callback: (packet: DecodedPacket) => void): SubscriberId {
        const subscriberId = crypto.randomUUID();
        const subscription = this._subject.subscribe(callback);
        this._subscribers.set(subscriberId, subscription);
        return subscriberId;
    }

    /**
     * Unsubscribe from the packets emitter
     * @param subscriberId - The subscriber id
     */
    unsubscribe(subscriberId?: SubscriberId): void {
        if (subscriberId) {
            const subscription = this._subscribers.get(subscriberId);
            if (subscription) {
                subscription.unsubscribe();
                this._subscribers.delete(subscriberId);
            }
        } else {
            this._subscribers.forEach(subscription => subscription.unsubscribe());
            this._subscribers.clear();
            this._subject.unsubscribe();
        }
    }

    /**
     * Get the active subscribers
     * @returns The active subscribers
     */
    getActiveSubscribers(): SubscriberId[] {
        return Array.from(this._subscribers.keys());
    }
}