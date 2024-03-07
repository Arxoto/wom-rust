import { router } from "../../core/constants";
import { isMain } from "../../core/runtime";
import { useElders, useNavigate, usePathId } from "../../router/hooks";
import { Body, Box, Head, HeadChaos, ReactDomWithChildren } from "../Layout";
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
    const navi = <div className="navi-path-box">
        {midPath.map((apath, index) => <div key={index}>
            <span className="a-btn a-btn-hidden navi-path-item" onClick={() => nav(apath)}>{apath}</span>
            <span>{link}</span>
        </div>)}
        <span className="navi-path-item">{last}</span>
    </div>
    return isMain() ?
        <Box>
            <Head>
                <div className="a-txt" onClick={() => nav(router.root)}>&lt;</div>
                {navi}
            </Head>
            <Body>{children}</Body>
        </Box>
        :
        <Box>
            <HeadChaos>
                {navi}
            </HeadChaos>
            <Body>{children}</Body>
        </Box>
}