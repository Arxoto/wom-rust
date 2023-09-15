import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Box, Head, Body, OffspringHead } from "../Layout";
import './Navigation.css';
import { isMain } from '../../app/runtime';

interface NavigationItem {
    index: number,
    pathname: string,
    showname: string,
    clickable: boolean
}

export default function () {
    const location = useLocation();
    const navigate = useNavigate();
    console.log(location.pathname);

    // 导航栏
    let shownames: string[] = location.pathname.split('/');

    // url[0] === '' （开头必定是'/' 跳过）
    // url[1:] 为自身的相对路径
    if (!(shownames.length > 1 && shownames[0] === '')) {
        throw 'illegal_url';
    }

    // assert shownames.length >= 2  因为 index 从 1 开始
    // assert navigations.length >= 1
    let navigations: NavigationItem[] = [];
    for (let index = 1; index < shownames.length; index++) {
        const showname = shownames[index];
        navigations.push({
            index,
            showname,
            pathname: shownames.slice(0, index + 1).join('/'),
            clickable: true
        })
    }
    // 最后一项为自身 不跳转
    navigations[navigations.length - 1].clickable = false;
    // 最后第二项为上一项 默认返回
    let onBack;
    if (navigations.length < 2) {
        // 导航页
        onBack = () => navigate('/');
    } else {
        onBack = () => navigate(navigations[navigations.length - 2].pathname);
    }
    return (
        <Box>
            {
                isMain() ?
                    <Head>
                        <div className='activable-text' onClick={onBack}>&lt;</div>
                        <div className='common-box navigation-box'>
                            {navigations.map(navigation => {
                                let inner;
                                if (navigation.clickable) {
                                    inner = <span className='common-color activable-button' onClick={() => navigate(navigation.pathname)}>{navigation.showname}</span>
                                } else {
                                    inner = <span>{navigation.showname}</span>
                                }
                                return <div key={navigation.index}>/{inner}</div>
                            })}
                        </div>
                    </Head>
                    :
                    <OffspringHead>
                        <div className='activable-text'>·</div>
                        <div className='common-box navigation-box'>{navigations[navigations.length - 1].showname}</div>
                    </OffspringHead>
            }
            <Body>
                <div style={{ display: 'flex', padding: '0 1em' }}><Outlet /></div>
            </Body>
        </Box>
    )
}