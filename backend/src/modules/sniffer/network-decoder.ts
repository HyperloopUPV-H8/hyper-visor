import { PacketWithHeader, decode } from 'pcap';
import { IDecoder } from '../../types/sniffer';

const IP_VERSION_4 = 4;
const IP_PROTOCOL_TCP = 16;
const IP_PROTOCOL_UDP = 17;

export class NetworkDecoder implements IDecoder {
    private _rawPacket!: PacketWithHeader;
    private _eth: any;
    private _ipv4: any;
    private _tcp: any;
    private _udp: any;
    private _payload: Buffer | null = null;

    decode(rawPacket: PacketWithHeader): void {
        this._rawPacket = rawPacket;
        const packet = decode.packet(rawPacket);

        this.eth = packet.payload;

        if (this.eth?.payload?.version === IP_VERSION_4) {
            this.ipv4 = this.eth.payload;
        } else {
            this.ipv4 = null;
        }

        const transport = this.ipv4?.payload;

        if (this.ipv4?.protocol === IP_PROTOCOL_TCP) {
            this.tcp = transport;
            this.udp = null;
            this.payload = this.tcp?.data || null;
        } else if (this.ipv4?.protocol === IP_PROTOCOL_UDP) {
            this.udp = transport;
            this.tcp = null;
            this.payload = this.udp?.data || null;
        } else {
            this.tcp = null;
            this.udp = null;
            this.payload = null;
        }
    }

    get rawPacket(): PacketWithHeader {
        return this._rawPacket;
    }

    get eth(): any {
        return this._eth;
    }

    get ipv4(): any {
        return this._ipv4;
    }

    get tcp(): any {
        return this._tcp;
    }

    get udp(): any {
        return this._udp;
    }

    get payload(): Buffer | null {
        return this._payload;
    }

    private set eth(value: any) {
        this._eth = value;
    }

    private set ipv4(value: any) {
        this._ipv4 = value;
    }

    private set tcp(value: any) {
        this._tcp = value;
    }

    private set udp(value: any) {
        this._udp = value;
    }

    private set payload(value: Buffer | null) {
        this._payload = value;
    }
}
