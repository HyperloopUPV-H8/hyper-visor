import { PacketId } from "types/adj";
import { PacketError } from "./base";
import { PacketErrorType } from "./packet-error-type.enum";

export class PacketDecodeError extends PacketError {
    constructor(message: string, packetId: PacketId, originalError: Error) {
        super(message, packetId, originalError);
        this.name = PacketErrorType.PACKET_DECODE_ERROR;
    }
}