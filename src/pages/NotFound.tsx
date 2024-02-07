import { getCurrent } from "@tauri-apps/api/window";
import { useNavigate } from "../router/hooks";
import { router } from "../core/constants";

export default function () {
    let nav = useNavigate();
    let w = getCurrent();

    // textAlign: 'center'
    return <div style={{ width: '100%', height: '100%', display: 'flex', flexFlow: 'column nowrap', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>Oooops!</div>
        <div style={{ fontSize: '4rem', fontStyle: 'italic' }}>404 not found</div>
        {
            w.label === "main" ?
                <div className="a-txt a-txt-diff" onClick={() => nav(router.root)}>click here to goto root</div>
                :
                <div className="a-btn" onClick={() => w.close()}>click here to close window</div>
        }
    </div>
}