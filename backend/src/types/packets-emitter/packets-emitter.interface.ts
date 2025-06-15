import { Subject, Subscription } from "rxjs";
import { DecodedPacket } from "types/packet/decoded-packet.interface";

/**
 * Interface for the packets emitter
 * @template T - The type of the packet
 * @description The packets emitter is a class that emits packets to the subscribers
 */
export interface IPacketsEmitter<T> {
    /**
     * The observable to subscribe to the buffer
     */
    _subject: Subject<T>;

    /**
     * The subscribers
     */
    _subscribers: Map<string, Subscription>;

    /**
     * Write a packet to the buffer
     * @param packet - The packet to be written to the buffer
     */
    emit(packet: T): void;

    /**
     * Subscribe to the buffer to receive packets
     * @param callback - The callback to be called when a packet is written to the buffer
     */
    subscribe(callback: (packet: T) => void): void;

    /**
     * Unsubscribe from the buffer
     * @param callback - The callback to be removed from the buffer
     */
    unsubscribe(): void;

    /**
     * Get the active subscribers
     */
    getActiveSubscribers(): string[];
}