import { BoardId, PacketId } from "types/adj";

export type DecodedPacket = {
    boardId: BoardId;
    packetId: PacketId;
    measurements: {
        id: string;
        value: any;
    }[];
}