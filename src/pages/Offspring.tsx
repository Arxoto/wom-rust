import { useState } from "react";
import { currentClose, currentMini, currentOnTop } from "../core/runtime";
import { ReactDomWithChildren } from "./Layout";
import "./Offspring.css"

export default function ({ children }: ReactDomWithChildren) {
    let [ontop, setOntop] = useState(false);
    return <>
        <div className="offspring-head">
            <div className={ontop ? "offspring-btn offspring-ontop-on" : "offspring-btn offspring-ontop-off"}
                onClick={() => { setOntop(!ontop); currentOnTop(!ontop); }}></div>
            <div className="offspring-group offspring-drag" data-tauri-drag-region>
                <div data-tauri-drag-region></div>
                <div data-tauri-drag-region></div>
                <div data-tauri-drag-region></div>
            </div>
            <div className="offspring-group">
                <div className="offspring-btn offspring-mini" onClick={() => { if (ontop) { setOntop(false); currentOnTop(false); } currentMini(); }}></div>
                <div className="offspring-btn offspring-close" onClick={currentClose}></div>
            </div>
        </div>
        <div className="offspring-body">{children}</div>
    </>
}