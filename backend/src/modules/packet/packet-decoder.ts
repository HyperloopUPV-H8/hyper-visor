import { ADJ } from "modules/adj";
import { err, ok, Result } from "neverthrow";
import { PacketError } from "./errors/base";
import { DecodedPacket } from "types/packet/decoded-packet.interface";
import { MeasurementType } from "types/adj";
import { PacketDecodeError } from "./errors/packet-decode.error";
import { IPacketDecoder } from "types/packet/packet-decoder.interface";

export class PacketDecoder implements IPacketDecoder {
    private _adj: ADJ;

    constructor(adj: ADJ) {
        this._adj = adj;
    }

    decode(packet: Buffer): Result<DecodedPacket, PacketDecodeError> {
        let offset = 0;
        const decodedPacket: DecodedPacket = {
            boardId: 0, 
            packetId: 0,
            measurements: [],
        };
        
        const packetId = packet.readUInt16LE(offset);
        offset += 2;

        decodedPacket.packetId = packetId;
        
        const packetMeasurements = this._adj.getPacketMeasurements(packetId);

        if (packetMeasurements.isErr()) {
            return err(new PacketError(`Error decoding packet ${packetId}: ${packetMeasurements.error.message}`, packetId, packetMeasurements.error));
        }

        for (const measurement of packetMeasurements.value) {
            const decodeMeasurementValueResult = this.decodeMeasurementValue(packet, offset, measurement.type);

            if (decodeMeasurementValueResult.isErr()) {
                return err(new PacketError(`Error decoding packet ${packetId}: ${decodeMeasurementValueResult.error.message}`, packetId, decodeMeasurementValueResult.error));
            }

            const { value, newOffset } = decodeMeasurementValueResult.value;
            offset = newOffset;
            decodedPacket.measurements.push({
                id: measurement.id,
                value,
            });
        }

        return ok(decodedPacket);
    }

    private decodeMeasurementValue(packet: Buffer, offset: number, type: MeasurementType): Result<{ value: any; newOffset: number }, PacketDecodeError> {
        let value: any;
        let newOffset = offset;

        try {
            switch (type) {
                case 'enum':
                    value = packet.readUInt8(offset);
                    newOffset += 1;
                    break;
                case 'bool':
                    value = packet.readUInt8(offset) === 1;
                    newOffset += 1;
                    break;
                case 'uint8':
                    value = packet.readUInt8(offset);
                    newOffset += 1;
                    break;
                case 'uint16':
                    value = packet.readUInt16LE(offset);
                    newOffset += 2;
                    break;
                case 'uint32':
                    value = packet.readUInt32LE(offset);
                    newOffset += 4;
                    break;
                case 'uint64':
                    value = packet.readBigUInt64LE(offset);
                    newOffset += 8;
                    break;
                case 'int8':
                    value = packet.readInt8(offset);
                    newOffset += 1;
                    break;
                case 'int16':
                    value = packet.readInt16LE(offset);
                    newOffset += 2;
                    break;
                case 'int32':
                    value = packet.readInt32LE(offset);
                    newOffset += 4;
                    break;
                case 'int64':
                    value = packet.readBigInt64LE(offset);
                    newOffset += 8;
                    break;
                case 'float32':
                    value = packet.readFloatLE(offset);
                    newOffset += 4;
                    break;
                case 'float64':
                    value = packet.readDoubleLE(offset);
                    newOffset += 8;
                    break;
            }
        } catch (error) {
            return err(new PacketDecodeError(`Error decoding measurement value`, packet.readUInt16LE(0), error as Error));
        }

        return ok({ value, newOffset });
    }
}