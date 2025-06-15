import { PacketId } from "types/adj";
import { PacketErrorType } from "./packet-error-type.enum";

export class PacketError extends Error {
    public readonly packetId: PacketId;
    public readonly originalError?: Error;

    constructor(message: string, packetId: PacketId, originalError?: Error) {
        super(message);
        this.name = PacketErrorType.PACKET_ERROR;
        this.originalError = originalError;
        this.packetId = packetId;
    }
}