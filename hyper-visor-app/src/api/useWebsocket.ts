import useWebsocket from "react-use-websocket";

interface Props {
    url: string;
}

export const useHyperloopSocket = ({url}: Props) => {

    const {} = useWebsocket(url);

    return (
        
    )
}
