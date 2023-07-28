import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Box, Head, Body } from "../Layout";
import './Navigation.css';

interface NavigationItem {
    index: number,
    pathname: string,
    showname: string,
    clickable: boolean
}

export default function () {
    const location = useLocation();
    console.log(location.pathname);

    // 导航栏
    let navigations: NavigationItem[] = [];
    let shownames: string[] = location.pathname.split('/');
    for (let index = 1; index < shownames.length; index++) {
        const showname = shownames[index];
        navigations.push({
            index,
            showname,
            pathname: shownames.slice(1, index + 1).join('/'),
            clickable: true
        })
    }
    navigations[navigations.length - 1].clickable = false;

    const navigate = useNavigate();
    return (
        <Box>
            <Head>
                <div className='activable-text' onClick={() => navigate('/')}>&lt;</div>
                <div className='common-box navigation-box'>
                    {navigations.map(navigation => {
                        let inner;
                        if (navigation.clickable) {
                            inner = <Link to={navigation.pathname} className='common-color activable-button'>{navigation.showname}</Link>
                        } else {
                            inner = <span>{navigation.showname}</span>
                        }
                        return <div key={navigation.index}>/{inner}</div>
                    })}
                </div>
            </Head>
            <Body>
                <Outlet />
            </Body>
        </Box>
    )
}