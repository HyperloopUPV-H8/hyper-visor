import { Device, PacketWithHeader, PcapSession } from "pcap";

/**
 * Interface that defines the structure of a Sniffer class
 * 
 * This class is follows the adapter pattern to encapsulate
 * the library in charge the logic of the sniffer
 * 
 * This interface establishes the contract to implement network packet
 * capture and analysis functionality (packet sniffing) on a specific
 * network interface
 * 
 * The class implementing this interface will be responsible for:
 * - Capturing network packets in real-time
 * - Analyzing packet contents
 * - Processing intercepted network information
 * - Managing the selected network interface
 */
export interface ISniffer {
    /**
     * The session object that manages the network interface
     */
    get session(): PcapSession;
    set session(value: PcapSession);

    /**
     * The network device name to capture packets from
     */
    get interface(): string;
    set interface(value: string);

    /**
     * The BPF (Berkeley Packet Filter) formatted filter to apply to the session
     */
    get filter(): string;
    set filter(value: string);

    /**
     * Start the session
     */
    startSession(): void;

    /**
     * Stop the session
     */
    stopSession(): void;

    /**
     * Callback function to handle incoming packets
     */
    onPacket(callback: (packet: PacketWithHeader) => void): any;
}