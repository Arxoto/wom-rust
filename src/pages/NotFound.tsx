import { useNavigate } from "../router/hooks";
import { router } from "../core/constants";
import { currentClose, isMain } from "../core/runtime";

export default function () {
    let nav = useNavigate();

    // textAlign: 'center'
    return <div style={{ width: '100%', height: '100%', display: 'flex', flexFlow: 'column nowrap', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>Oooops!</div>
        <div style={{ fontSize: '4rem', fontStyle: 'italic' }}>404 not found</div>
        {
            isMain() ?
                <div className="a-txt a-txt-diff" onClick={() => nav(router.root)}>click here to goto root</div>
                :
                <div className="a-btn" onClick={currentClose}>click here to close window</div>
        }
    </div>
}