import { ADJ } from './ADJ';
import { promises as fs } from 'fs';
import { err, ok, Result } from 'neverthrow';
import * as path from 'path';
import { ADJLectureError } from './errors/ADJLecture';
import { Board, BoardName } from 'types/adj';

export class ADJConstructor {
    private _adj!: ADJ;
    private _adjPath: string;

    constructor(adjPath: string) {
        this._adjPath = adjPath;
        this._adj = new ADJ();
    }

    public async execute(): Promise<ADJ> {
        const boardsDefinitionFilePath = path.join(this._adjPath, 'boards.json');
        const registerBoardsResult = await this.registerBoards(boardsDefinitionFilePath);

        if (registerBoardsResult.isErr()) {
            throw registerBoardsResult.error;
        }

        const registerPacketsResult = await this.registerPackets();

        return this._adj;
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
        for (const board of this._adj.boards) {
            const packetsFilePath = path.join(this._adjPath, 'boards', board.name, 'packets.json');
            console.log(packetsFilePath);
            try {
                const packetsFile = await fs.readFile(packetsFilePath);
                const packetsObj = JSON.parse(packetsFile.toString());
                const packets = Object.keys(packetsObj);
                return ok();
            } catch (error) {
                return err(new ADJLectureError(`Error while reading packets file: ${error}`, error as Error, packetsFilePath));
            }
        }

        return err(new ADJLectureError('No boards found to register packets', new Error('No boards found to register packets'), ''));
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
}