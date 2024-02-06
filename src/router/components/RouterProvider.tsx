import { ReactNode, useState } from "react";
import { RouterContext } from "../context";

interface RouterPath {
    path: string,
    element: ReactNode,
}

interface RouterProviderArgs {
    router: RouterPath[],
    notfound: ReactNode,
}

export default function ({ router, notfound }: RouterProviderArgs) {
    let [pathname, setPathname] = useState(window.location.pathname);
    return <RouterContext.Provider value={{ navigate: setPathname }}>
        {router.find(r => r.path === pathname)?.element ?? notfound ?? "404_not_found"}
    </RouterContext.Provider>
}