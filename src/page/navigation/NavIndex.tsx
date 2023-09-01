import { useNavigate } from 'react-router-dom';

import { constants } from "../../app/env";

export default function () {
    const navigate = useNavigate();
    const routers = [
        [constants.router_setting_name, constants.router_setting_path],
    ];
    return <div>{routers.map((router_pair, i) => {
        return <div key={i} className='activable-button common-color big-box' onClick={() => navigate(router_pair[1])}>{router_pair[0]}</div>
    })}
    </div>
}