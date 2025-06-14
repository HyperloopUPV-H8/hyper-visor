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
        
        // Decodificar cada medición según su tipo
        for (const measurement of packetMeasurements) {
            let value: any;
            
            switch (measurement.type) {
                case 'enum':
                    value = packet.readUInt8(offset);
                    offset += 1;
                    break;
                case 'bool':
                    value = packet.readUInt8(offset) === 1;
                    offset += 1;
                    break;
                case 'uint8':
                    value = packet.readUInt8(offset);
                    offset += 1;
                    break;
                case 'uint16':
                    value = packet.readUInt16LE(offset);
                    offset += 2;
                    break;
                case 'uint32':
                    value = packet.readUInt32LE(offset);
                    offset += 4;
                    break;
                case 'uint64':
                    value = packet.readBigUInt64LE(offset);
                    offset += 8;
                    break;
                case 'int8':
                    value = packet.readInt8(offset);
                    offset += 1;
                    break;
                case 'int16':
                    value = packet.readInt16LE(offset);
                    offset += 2;
                    break;
                case 'int32':
                    value = packet.readInt32LE(offset);
                    offset += 4;
                    break;
                case 'int64':
                    value = packet.readBigInt64LE(offset);
                    offset += 8;
                    break;
                case 'float32':
                    value = packet.readFloatLE(offset);
                    offset += 4;
                    break;
                case 'float64':
                    value = packet.readDoubleLE(offset);
                    offset += 8;
                    break;
            }
        }
    }
}