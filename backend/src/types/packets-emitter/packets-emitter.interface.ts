import { Observer, Subject, Subscription } from "rxjs";

export type SubscriberId = string;

/**
 * Interface for the packets emitter
 * @template T - The type of the packet
 * @description The packets emitter is a class that emits packets to the subscribers
 */
export interface IPacketsEmitter<T> {
    /**
     * The observable to subscribe to the emitter
     */
    _subject$: Subject<T>;

    /**
     * The subscribers set
     */
    _subscribers: Map<SubscriberId, Subscription>;

    /**
     * Emit a packet to the subscribers
     * @param packet - The packet to be written to the subscribers
     */
    emit(packet: T): void;

    // /**
    //  * Subscribe to the buffer to receive packets
    //  * @param callback - The callback to be called when a packet is written to the buffer
    //  */
    subscribe(callback: (packet: T) => void): SubscriberId;
}