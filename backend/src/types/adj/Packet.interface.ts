export type PacketId = number;
export type PacketType = string;
export type PacketName = string;
export type PacketVariable = string;

export interface Packet {
    id: PacketId;
    type: PacketType;
    name: PacketName;
    variables: PacketVariable[];
}