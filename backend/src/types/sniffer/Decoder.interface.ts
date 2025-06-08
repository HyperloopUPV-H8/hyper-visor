import { PacketWithHeader } from 'pcap';

export interface IDecoder {
    decode(packet: PacketWithHeader): void;
    readonly ipv4: any | null;
    readonly tcp: any | null;
    readonly udp: any | null;
    readonly payload: Buffer | null;
}
