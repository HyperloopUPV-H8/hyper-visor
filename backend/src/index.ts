import { Decoder, Sniffer } from "./modules/sniffer";
import { ADJConstructor } from "./modules/adj";

// const sniffer = new Sniffer("eth0", "udp and dst port 8002");

// const decoder = new Decoder();

// sniffer.onPacket((packet) => {
//     decoder.decode(packet);
//     console.log(decoder.payload);
// });

// sniffer.startSession();

const adjConstructor = new ADJConstructor('./adj');

adjConstructor.execute();
