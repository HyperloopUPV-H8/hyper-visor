import { Sniffer, NetworkDecoder, PacketDecoder } from "./modules/sniffer";
import { ADJConstructor } from "./modules/adj";
import { logger } from "./modules/logger";
import { interval, sample, Subject } from "rxjs";

const PCAP_INTERFACE = "eth0";
const PCAP_FILTER = "udp and dst port 8002";

(async () => {
    const sniffer = new Sniffer(PCAP_INTERFACE, PCAP_FILTER);

    const adjConstructor = new ADJConstructor('./adj');

    const adj = await adjConstructor.execute();
    
    if (adj.isErr()) {
        logger.error(adj.error);
        return;
    }
    
    const packetDecoder = new PacketDecoder(adj.value);

    const networkdecoder = new NetworkDecoder();
    
    const packetSubject = new Subject<Buffer>();

    sniffer.onPacket((packet) => {
        networkdecoder.decode(packet);
        packetSubject.next(networkdecoder.payload!);
    });

    packetSubject.pipe(
        sample(interval(100))
    ).subscribe((packet) => {
        packetDecoder.decode(packet);
    })

    sniffer.startSession();
})()