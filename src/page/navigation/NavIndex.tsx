import { useNavigate } from 'react-router-dom';

import { router } from "../../app/env";

export default function () {
    const navigate = useNavigate();
    const routers = [
        [router.setting_name, router.setting_path],
    ];
    return <div>{routers.map((pair, i) => {
        return <div key={i} className='activable-button common-color big-box' onClick={() => navigate(pair[1])}>{pair[0]}</div>
    })}
    </div>
}