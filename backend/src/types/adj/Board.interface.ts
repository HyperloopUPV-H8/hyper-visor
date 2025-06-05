export type BoardId = number;
export type BoardIp = string;
export type BoardMeasurement = string;
export type BoardPacket = string;

export interface Board {
    id: BoardId;
    ip: BoardIp;
    measurements: BoardMeasurement[];
    packets: BoardPacket[];
}