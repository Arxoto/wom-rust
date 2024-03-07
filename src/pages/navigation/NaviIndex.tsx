import { convertFileSrc } from "@tauri-apps/api/tauri";
import { router } from "../../core/constants";
import { exWebView } from "../../core/runtime";
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
            {/* iframe-https will print AssetNotFound("index.html") */}
            <div className="a-txt a-txt-diff" onClick={() => exWebView('plugins', 'https://tauri.app/')}>https://tauri.app/</div>
            <div className="a-txt a-txt-diff" onClick={() => exWebView('plugins', convertFileSrc('D:\\develop\\xxx.html'))}>file:///D:/develop/xxx.html</div>
            <div className="a-txt a-txt-diff" onClick={() => exWebView('plugins', convertFileSrc('D:/develop/xxx.html'))}>file:///D:/develop/xxx.html</div>
        </div>
    </NaviBox>
}