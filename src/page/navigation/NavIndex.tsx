import { useNavigate } from 'react-router-dom';

import { router } from "../../app/env";

import navigation from "../../assets/navigation.svg";
import setting from "../../assets/setting-1.svg";

import './NavIndex.css'
import { pageWebView } from '../../app/runtime';

export default function () {
    const navigate = useNavigate();
    return <>
        <h1 className='nav-index-header'>
            <img src={navigation} alt="" style={{ width: '2em' }} />
            <span>~ The Navigation Page</span>
        </h1>

        <div style={{ fontSize: '1.4em' }}>

            <div className='nav-index-body-line' onClick={() => navigate(router.setting_path)}>
                <img src={setting} alt="" style={{ width: '2em' }} />
                <span>goto &lt;{router.setting_name}&gt;</span>
            </div>

            <div className='nav-index-body-line' onClick={() => pageWebView(router.navigation_name, router.navigation_path)}>
                <img src={setting} alt="" style={{ width: '2em' }} />
                <span>open &lt;{router.navigation_name}&gt;(test)</span>
            </div>

        </div>




    </>
}