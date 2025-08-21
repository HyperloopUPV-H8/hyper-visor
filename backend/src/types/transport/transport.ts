export interface ITransport {
    /**
     * Start the websocket server
     * Initializes the connection, sets up event listeners and starts emitting packets
     */
    start(): void;

    /**
     * Stop the websocket server
     * Closes connections and cleans up resources
     */
    stop(): void;
}