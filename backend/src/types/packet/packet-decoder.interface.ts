import { Result } from "neverthrow";
import { DecodedPacket } from "./decoded-packet.interface";
import { PacketDecodeError } from "modules/packet/errors/packet-decode.error";

export interface IPacketDecoder {
    decode(packet: Buffer): Result<DecodedPacket, PacketDecodeError>;
}