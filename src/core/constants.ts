const router = {
    navigation: 'navigation',
    setting: 'setting',
    config: 'config',
}

interface Router {
    path: string,
    link: string[],  // 父节点们
}

const routerMap = new Map<string, Router>([
    [router.navigation, { path: '/navigation', link: [] }],
    [router.setting, { path: '/navigation/setting', link: [router.navigation] }],
    [router.config, { path: '/navigation/config', link: [router.navigation] }],
]);

const getRouter = (routerName: string) => routerMap.get(routerName);

export {
    router,
    getRouter,
};