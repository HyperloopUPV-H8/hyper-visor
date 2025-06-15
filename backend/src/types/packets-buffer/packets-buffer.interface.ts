export interface IPacketsBuffer {
    /**
     * The internal buffer to store the packets to be sended to the subscribers
     */
    buffer: Buffer;

    /**
     * Write a packet to the buffer
     * @param packet - The packet to be written to the buffer
     */
    write(packet: any): void;

    /**
     * Subscribe to the buffer to receive packets
     * @param callback - The callback to be called when a packet is written to the buffer
     */
    subscribe(callback: (packet: any) => void): void;

    /**
     * Unsubscribe from the buffer
     * @param callback - The callback to be removed from the buffer
     */
    unsubscribe(callback?: (packet: any) => void): void;
}