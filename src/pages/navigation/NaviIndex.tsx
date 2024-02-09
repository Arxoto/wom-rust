import { router } from "../../core/constants";
import { useNavigate } from "../../router/hooks";
import NaviBox from "./NaviBox";
import "./NaviIndex.css";

export default function () {
    let nav = useNavigate();
    return <NaviBox>
        <div className="navi-index-box">
            <h1>~ The Navigation Page ~</h1>
            {[router.config, router.setting].map((pid, index) =>
                <div key={index} className="a-txt a-txt-diff" onClick={() => nav(pid)}>{pid}</div>)
            }
        </div>
    </NaviBox>
}