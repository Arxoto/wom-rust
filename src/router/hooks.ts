import { useContext } from "react";
import { RouterContext } from "./context";

export function useNavigate() {
    const { navigate } = useContext(RouterContext);
    return navigate;
}
