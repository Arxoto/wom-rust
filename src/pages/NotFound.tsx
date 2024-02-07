import { getCurrent } from "@tauri-apps/api/window";
import { useNavigate } from "../router/hooks";

export default function () {
    let nav = useNavigate();
    let window = getCurrent();
    // textAlign: 'center'
    return <div style={{ width: '100%', height: '100%', display: 'flex', flexFlow: 'column nowrap', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>Oooops!</div>
        <div style={{ fontSize: '4rem', fontStyle: 'italic' }}>404 not found</div>
        {
            window.label === "main" ?
                <div className="a-txt a-txt-diff" onClick={() => nav("/")}>click here to goto root</div>
                :
                <div className="a-btn" onClick={() => window.close()}>click here to close window</div>
        }
    </div>
}