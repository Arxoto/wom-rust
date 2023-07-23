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
                <div className='common-box activable-hide' onClick={() => navigate('/')}>&lt;</div>
                <ul>
                    {navigations.map(navigation => {
                        if (navigation.clickable) {
                            return <li key={navigation.index}>
                                <Link to={navigation.pathname} className='common-box common-color round-box activable'>{navigation.showname}</Link>
                            </li>
                        } else {
                            return <span className='common-box'>/{navigation.showname}</span>
                        }
                    })}
                </ul>
            </Head>
            <Body>
                <Outlet />
            </Body>
        </Box>
    )
}