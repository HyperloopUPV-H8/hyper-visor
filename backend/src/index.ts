import { Sniffer, NetworkDecoder, PacketDecoder } from "./modules/sniffer";
import { ADJConstructor } from "./modules/adj";
import { logger } from "./modules/logger";
import { PacketsEmitter } from "./modules/packets-emitter";
import { Transport } from "./modules/transport/transport";

const PCAP_INTERFACE = "eth0";
const PCAP_FILTER = "udp and dst port 8002";

(async () => {
    logger.info('[Index] Starting the sniffer');
    const sniffer = new Sniffer(PCAP_INTERFACE, PCAP_FILTER);

    logger.info('[Index] Starting the ADJ constructor');
    const adjConstructor = new ADJConstructor('./adj');

    logger.info('[Index] Building the ADJ structure');
    const adj = await adjConstructor.execute();
    
    if (adj.isErr()) {
        logger.error(adj.error);
        return;
    }
    
    logger.info('[Index] Initializing the packet decoder');
    const packetDecoder = new PacketDecoder(adj.value);

    logger.info('[Index] Initializing the network decoder');
    const networkdecoder = new NetworkDecoder();
    
    logger.info('[Index] Initializing the packets emitter');
    const packetsEmitter = new PacketsEmitter();

    logger.info('[Index] Initializing the transport');
    const transport = new Transport(packetsEmitter, adj.value);

    logger.info('[Index] Starting the transport');
    transport.start();

    sniffer.onPacket((packet) => {
        networkdecoder.decode(packet);
        const decodedPacket = packetDecoder.decode(networkdecoder.payload!);

        if (decodedPacket.isOk()) {
            packetsEmitter.emit(decodedPacket.value);
        }
    });

    logger.info('[Index] Starting the sniffer session');
    sniffer.startSession();
})()