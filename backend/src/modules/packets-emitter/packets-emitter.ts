import { logger } from "../../modules/logger";
import { Observer, Subject, Subscription } from "rxjs";
import { DecodedPacket } from "types/packet/decoded-packet.interface";
import { IPacketsEmitter, SubscriberId } from "types/packets-emitter/packets-emitter.interface";
import { v4 as uuidv4 } from 'uuid';


/**
 * Class that emits packets to the subscribers
 * @description The packets emitter is a class that emits packets to the subscribers
 * @template T - The type of the packet
 * @implements {IPacketsEmitter<T>} - The interface for the packets emitter
 */
export class PacketsEmitter implements IPacketsEmitter<DecodedPacket> {
    _subject$: Subject<DecodedPacket>;
    _subscribers: Map<SubscriberId, Subscription>;

    constructor() {
        logger.info('[PacketsEmitter] Initializing the packets emitter');
        this._subject$ = new Subject<DecodedPacket>();
        this._subscribers = new Map();
    }

    /**
     * Emit a packet to the subscribers
     * @param packet - The packet to be emitted
     */
    emit(packet: DecodedPacket): void {
        this._subject$.next(packet);
    }

    /**
     * Subscribe to the packets emitter
     * @returns The subscriber id
     */
    public subscribe(callback: (packet: DecodedPacket) => void): SubscriberId {
        const subscriberId = uuidv4();
        this._subscribers.set(subscriberId, this._subject$.subscribe(callback));
        return subscriberId;
    }

    /**
     * Unsubscribe from the packets emitter
     * @returns The subscriber id
     */
    public unsubscribe(subscriberId: SubscriberId): SubscriberId {
        this._subscribers.get(subscriberId)?.unsubscribe();
        this._subscribers.delete(subscriberId);
        return subscriberId;
    }
}