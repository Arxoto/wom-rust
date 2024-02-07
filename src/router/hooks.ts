import { useContext } from "react";
import { RouterContext } from "./context";

export function usePathId() {
    const { pathId } = useContext(RouterContext);
    return pathId;
}

export function useNavigate() {
    const { navigate } = useContext(RouterContext);
    return navigate;
}

export function useElders() {
    const { elders } = useContext(RouterContext);
    return (nodeId: string) => elders.get(nodeId)
}