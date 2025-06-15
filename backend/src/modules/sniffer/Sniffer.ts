import { ISniffer } from '../../types/sniffer';
import { PacketWithHeader, PcapSession, createSession } from 'pcap';
import { logger } from '../logger';

export class Sniffer implements ISniffer {
    private _session!: PcapSession;
    private _interface: string;
    private _filter: string;

    private packetCallback: ((packet: PacketWithHeader) => void) | null = null;

    constructor(networkInterface: string, filter: string = '') {
        this._interface = networkInterface;
        this._filter = filter;
    }

    startSession(): void {
        this._session = createSession(this._interface, { filter: this._filter });

        this._session.on('packet', (rawPacket: PacketWithHeader) => {
        if (this.packetCallback) {
            this.packetCallback(rawPacket);
        }
        });

        logger.info(`[Sniffer] Session started on interface: ${this._interface} with filter: "${this._filter}"`);
    }

    stopSession(): void {
        if (this._session) {
            this._session.close();
            logger.info(`[Sniffer] Session stopped on interface: ${this._interface}`);
        }
    }

    onPacket(callback: (packet: PacketWithHeader) => void): void {
        this.packetCallback = callback;
    }

    get session(): PcapSession {
        return this._session;
    }

    set session(value: PcapSession) {
        this._session = value;
    }

    get interface(): string {
        return this._interface;
    }

    set interface(value: string) {
        this._interface = value;
    }

    get filter(): string {
        return this._filter;
    }

    set filter(value: string) {
        this._filter = value;
    }
}
