import { Subject, Subscription } from "rxjs";
import { DecodedPacket } from "types/packet/decoded-packet.interface";
import { IPacketsEmitter } from "types/packets-emitter/packets-emitter.interface";

type SubscriberId = string;

export class PacketsEmitter implements IPacketsEmitter {
    _subject: Subject<DecodedPacket>;
    _subscribers: Map<SubscriberId, Subscription>;

    constructor() {
        this._subject = new Subject<DecodedPacket>();
        this._subscribers = new Map();
    }

    emit(packet: DecodedPacket): void {
        this._subject.next(packet);
    }

    subscribe(callback: (packet: DecodedPacket) => void): SubscriberId {
        const subscriberId = crypto.randomUUID();
        const subscription = this._subject.subscribe(callback);
        this._subscribers.set(subscriberId, subscription);
        return subscriberId;
    }

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

    getActiveSubscribers(): SubscriberId[] {
        return Array.from(this._subscribers.keys());
    }
}