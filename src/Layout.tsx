import { Outlet } from 'react-router-dom'

export default function Layout() {
    // 可以添加导航栏等
    return (
        <main>
            <Outlet />
        </main>
    )
}