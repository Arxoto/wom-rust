import { Link, Outlet } from 'react-router-dom'

export default function () {
    // 可以添加导航栏等
    let navigations: string[] = [
        '/',
        'navigation',
    ]
    return (
        <div>
            <h1>Navigation Head</h1>
            <ul>
                {navigations.map(navigation => (
                    <li key={navigation}>
                        <Link to={navigation}>{navigation}</Link>
                    </li>
                ))}
            </ul>

            <Outlet />
        </div>
    )
}