import { err, ok, Result } from "neverthrow";
import { Board, BoardId, Measurement, MeasurementId, Packet, PacketId } from "types/adj";
import { PacketError } from "./errors/packet.error";

export class ADJ {
    private _boards: Map<BoardId, Board>;
    private _packets: Map<PacketId, Packet>;
    private _measurements: Map<MeasurementId, Measurement>;

    constructor() {
        this._boards = new Map();
        this._packets = new Map();
        this._measurements = new Map();
    }

    addBoard(board: Board): void {
        this._boards.set(board.id, board);
    }

    addPacket(packet: Packet): void {
        this._packets.set(packet.id, packet);
    }

    addMeasurement(measurement: Measurement): void {
        this._measurements.set(measurement.id, measurement);
    }
    
    getPacketMeasurements(packetId: PacketId): Result<Measurement[], PacketError> {
        const packet = this._packets.get(packetId);

        if (!packet) {
            return err(new PacketError(packetId, new Error(`Packet with id ${packetId} not found`)));
        }
        
        const measurementsIds = packet.variables;

        const measurements : Measurement[] = [];

        for (const measurementId of measurementsIds) {
            const measurement = this._measurements.get(measurementId);
            if (!measurement) {
                continue;
            }
            measurements.push(measurement);
        }
        
        return ok(measurements);
    }

    get boards(): Map<BoardId, Board> {
        return this._boards;
    }

    get packets(): Map<PacketId, Packet> {
        return this._packets;
    }

    get measurements(): Map<MeasurementId, Measurement> {
        return this._measurements;
    }
}