export interface Board {
    id: BoardId;
    name: BoardName;
    ip: BoardIp;
    measurements: BoardMeasurement[];
    packets: BoardPacket[];
}

export type BoardId = number;
export type BoardName = string;
export type BoardIp = string;
export type BoardMeasurement = string;
export type BoardPacket = string;
