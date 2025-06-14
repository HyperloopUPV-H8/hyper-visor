import { Decoder, Sniffer } from "./modules/sniffer";
import { ADJConstructor } from "./modules/adj";

const PCAP_INTERFACE = "eth0";
const PCAP_FILTER = "udp and dst port 8002";

// const sniffer = new Sniffer(PCAP_INTERFACE, PCAP_FILTER);

// const decoder = new Decoder();

// sniffer.onPacket((packet) => {
//     decoder.decode(packet);
//     console.log(decoder.payload);
// });

// sniffer.startSession();

(async () => {
    const adjConstructor = new ADJConstructor('./adj');

    const adjResult = await adjConstructor.execute();
    
    if (adjResult.isErr()) {
        console.error(adjResult.error);
    } else {
        console.log(adjResult.value);
    }
})()
