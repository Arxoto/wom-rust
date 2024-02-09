import { router } from "../../core/constants";
import { useElders, useNavigate, usePathId } from "../../router/hooks";
import { Body, Box, HeadChaos, ReactDomWithChildren } from "../Layout";
import NotFound from "../NotFound";
import "./NaviBox.css";

export default function ({ children }: ReactDomWithChildren) {
    let nav = useNavigate();
    let pid = usePathId();
    let elders = useElders()(pid);
    if (!elders || !elders.length) {
        return <NotFound></NotFound>
    }

    const midPath = elders.slice(1);
    const last = pid;
    const link = "·";
    return <Box>
        <HeadChaos>
            <div className="a-txt" onClick={() => nav(router.root)}>&lt;</div>
            <div className="navi-path-box">
                {midPath.map((apath, index) => <>
                    <div className="a-btn a-btn-hidden navi-path-item" key={index} onClick={() => nav(apath)}>{apath}</div>
                    <div>{link}</div>
                </>)}
                <div className="navi-path-item">{last}</div>
            </div>
        </HeadChaos>
        <Body>{children}</Body>
    </Box>
}