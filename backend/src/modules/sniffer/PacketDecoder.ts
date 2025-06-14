import { ADJ } from "modules/adj";
import { Measurement } from "types/adj";

export class PacketDecoder {
    private _adj: ADJ;

    constructor(adj: ADJ) {
        this._adj = adj;
    }

    decode(packet: Buffer): void {
        let offset = 0;
        
        const packetId = packet.readUInt16LE(offset);
        offset += 2;
        
        const packetMeasurements = this._adj.getPacketMeasurements(packetId);
        
        for (const measurement of packetMeasurements) {
            const { value, newOffset } = this.decodeMeasurementValue(packet, offset, measurement.type);
            offset = newOffset;

            // TODO - Save value 
            console.log(value);
        }
    }

    private decodeMeasurementValue(packet: Buffer, offset: number, type: string): { value: any; newOffset: number } {
        let value: any;
        let newOffset = offset;

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

        return { value, newOffset };
    }
}