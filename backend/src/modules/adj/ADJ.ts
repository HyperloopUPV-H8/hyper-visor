import { Board, Measurement, Packet } from "types/adj";

export class ADJ {
    private _boards: Board[];
    private _packets: Packet[];
    private _measurements: Measurement[];

    constructor() {
        this._boards = [];
        this._packets = [];
        this._measurements = [];
    }

    addBoard(board: Board): void {
        this._boards.push(board);
    }

    addPacket(packet: Packet): void {
        this._packets.push(packet);
    }

    addMeasurement(measurement: Measurement): void {
        this._measurements.push(measurement);
    }

    get boards(): Board[] {
        return this._boards;
    }

    get packets(): Packet[] {
        return this._packets;
    }

    get measurements(): Measurement[] {
        return this._measurements;
    }
}