import { PacketId } from "types/adj";
import { ADJError } from "./base";

export class PacketError extends ADJError {
    public readonly packetId: PacketId;

    constructor(packetId: PacketId, originalError: Error) {
        super(`Packet with id ${packetId} not found`, originalError);
        this.packetId = packetId;
    }
}