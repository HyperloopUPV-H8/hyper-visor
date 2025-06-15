import { Subject, Subscription } from "rxjs";
import { DecodedPacket } from "types/packet/decoded-packet.interface";

export interface IPacketsEmitter {
    /**
     * The observable to subscribe to the buffer
     */
    _subject: Subject<DecodedPacket>;

    /**
     * The subscribers
     */
    _subscribers: Map<string, Subscription>;

    /**
     * Write a packet to the buffer
     * @param packet - The packet to be written to the buffer
     */
    emit(packet: DecodedPacket): void;

    /**
     * Subscribe to the buffer to receive packets
     * @param callback - The callback to be called when a packet is written to the buffer
     */
    subscribe(callback: (packet: DecodedPacket) => void): void;

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