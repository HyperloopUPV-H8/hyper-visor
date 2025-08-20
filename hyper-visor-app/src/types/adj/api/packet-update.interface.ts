import type { BoardId } from "../Board.interface";
import type { MeasurementId } from "../Measurement.interface";
import type { PacketId } from "../Packet.interface";

export type MeasurementValue = number | string | boolean;

export interface PacketUpdate {
    boardId: BoardId;
    packetId: PacketId;
    measurements: {
        measurementId: MeasurementId;
        value: MeasurementValue;
    }[];
}