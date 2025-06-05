import express from "express";
import pcap from "pcap";

const app = express();

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

export default app;