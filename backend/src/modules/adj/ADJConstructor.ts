import { ADJ } from './ADJ';
import { promises as fs } from 'fs';
import { err, ok, Result } from 'neverthrow';
import * as path from 'path';
import { ADJLectureError } from './errors/ADJLecture';
import { Board, BoardName, Measurement, Packet } from 'types/adj';
import { ADJError } from './errors/base';

const FILES_REGEX = {
    PACKETS: /packets.*\.json$/,
    MEASUREMENTS: /measurements.*\.json$/,
}

export class ADJConstructor {
    private _adj!: ADJ;
    private _adjPath: string;

    constructor(adjPath: string) {
        this._adjPath = adjPath;
        this._adj = new ADJ();
    }

    public async execute(): Promise<Result<ADJ, ADJError>> {
        const boardsDefinitionFilePath = path.join(this._adjPath, 'boards.json');

        const registerBoardsResult = await this.registerBoards(boardsDefinitionFilePath);

        if (registerBoardsResult.isErr()) {
            return err(registerBoardsResult.error);
        }

        const registerPacketsResult = await this.registerPackets();

        if (registerPacketsResult.isErr()) {
            return err(registerPacketsResult.error);
        }

        const registerMeasurementsResult = await this.registerMeasurements();

        if (registerMeasurementsResult.isErr()) {
            return err(registerMeasurementsResult.error);
        }

        return ok(this._adj);
    }

    private async registerBoards(boardsDefinitionFilePath: string): Promise<Result<void, ADJLectureError>> {
        try {
            const boardsDefinitionFile = await fs.readFile(boardsDefinitionFilePath);
            const boardsDefinitionObj = JSON.parse(boardsDefinitionFile.toString());
            const boardNames = Object.keys(boardsDefinitionObj);
            
            for (const boardName of boardNames) {
                const boardInfoPath = boardsDefinitionObj[boardName];
                const board = await this.buildBoardFromFile(boardName, path.join(this._adjPath, boardInfoPath));
                if (board.isErr()) {
                    return err(board.error);
                } else {
                    this._adj.addBoard(board.value);
                }
            }
            return ok();
        } catch (error) {
            return err(new ADJLectureError(`Error while reading boards definition file: ${error}`, error as Error, boardsDefinitionFilePath));
        }
    }
    
    private async registerPackets(): Promise<Result<void, ADJLectureError>> {
        for (const board of this._adj.boards.values()) {
            const boardDir = await fs.readdir(path.join(this._adjPath, 'boards', board.name));
            const packetsFiles = boardDir.filter((file: string) => FILES_REGEX.PACKETS.test(file));
            const packetsFilesPaths = packetsFiles.map((file: string) => path.join(this._adjPath, 'boards', board.name, file));

            for (const packetsFilePath of packetsFilesPaths) {
                try {
                    const packets = await this.buildPacketsFromFile(packetsFilePath);
                    if (packets.isErr()) {
                        return err(packets.error);
                    } else {
                        for (const packet of packets.value) {
                            this._adj.addPacket(packet);
                        }
                    }
                } catch (error) {
                    return err(new ADJLectureError(`Error while reading packets file: ${error}`, error as Error, packetsFilePath));
                }
            }
        }
        return ok();
    }

    private async registerMeasurements(): Promise<Result<void, ADJLectureError>> {
        for (const board of this._adj.boards.values()) {
            const boardDir = await fs.readdir(path.join(this._adjPath, 'boards', board.name))
            const measurementsFiles = boardDir.filter((file: string) => FILES_REGEX.MEASUREMENTS.test(file))
            const measurementsFilesPaths = measurementsFiles.map((file: string) => path.join(this._adjPath, 'boards', board.name, file))

            for (const measurementsFilePath of measurementsFilesPaths) {
                try {
                    const measurements = await this.buildMeasurementsFromFile(measurementsFilePath);
                    if (measurements.isErr()) {
                        return err(measurements.error);
                    } else {
                        for (const measurement of measurements.value) {
                            this._adj.addMeasurement(measurement);
                        }
                    }
                } catch (error) {
                    return err(new ADJLectureError(`Error while reading measurements file: ${error}`, error as Error, measurementsFilePath));
                }
            }
        }
        return ok();
    }

    private async buildBoardFromFile(boardName: BoardName, path: string): Promise<Result<Board, ADJLectureError>> {
        try {
            const boardInfoFile = await fs.readFile(path);
            const boardInfoObj = JSON.parse(boardInfoFile.toString());

            const newBoard = {
                id: boardInfoObj.board_id,
                name: boardName,
                ip: boardInfoObj.board_ip,
                measurements: boardInfoObj.measurements,
                packets: boardInfoObj.packets,
            }

            return ok(newBoard);
        } catch (error) {
            return err(new ADJLectureError(`Error while reading board info file: ${error}`, error as Error, path));
        }
    }

    private async buildPacketsFromFile(path: string): Promise<Result<Packet[], ADJLectureError>> {
        const packets: Packet[] = [];
        try {
            const packetsFile = await fs.readFile(path);
            const packetsObj = JSON.parse(packetsFile.toString());
            for (const packet of packetsObj) {
                const newPacket: Packet = {
                    id: packet.id,
                    type: packet.type,
                    name: packet.name,
                    variables: packet.variables,
                }
                packets.push(newPacket);
            }
            return ok(packets);
        } catch (error) {
            return err(new ADJLectureError(`Error while reading packets file: ${error}`, error as Error, path));
        }
    }


    private async buildMeasurementsFromFile(measurementsFilePath: string): Promise<Result<Measurement[], ADJLectureError>> {
        const measurements: Measurement[] = [];
        try {
            const measurementsFile = await fs.readFile(measurementsFilePath);
            const measurementsObj = JSON.parse(measurementsFile.toString());
            for (const measurement of measurementsObj) {
                const newMeasurement: Measurement = {
                    id: measurement.id,
                    name: measurement.name,
                    type: measurement.type,
                    podUnits: measurement.podUnits,
                    displayUnits: measurement.displayUnits,
                }
                measurements.push(newMeasurement);
            }
            return ok(measurements);
        } catch (error) {
            return err(new ADJLectureError(`Error while reading measurements file: ${error}`, error as Error, measurementsFilePath));
        }
    }
}