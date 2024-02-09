import { ReactNode, useState } from "react";
import { RouterContext } from "../context";

interface RouterNode {
    nodeId: string,
    element: ReactNode,
    children?: RouterNode[],
}

interface RouterProviderArgs {
    root: RouterNode,
    notfound: ReactNode,
}

const genRouterTree = (root: RouterNode): [Map<string, string[]>, Map<string, string[]>, Map<string, ReactNode>] => {
    let ll = [root];
    let nodes = new Map<string, ReactNode>([[root.nodeId, root.element]]);
    let elders = new Map<string, string[]>([[root.nodeId, []]]);
    let junior = new Map<string, string[]>();
    while (ll.length) {
        let current = ll.pop();
        if (!current) break;
        if (current.children && current.children.length) {
            let path = elders.get(current.nodeId);
            if (!path) continue;
            const j = [];
            for (const child of current.children) {
                ll.push(child);
                j.push(child.nodeId);
                elders.set(child.nodeId, [...path, current.nodeId]);
                nodes.set(child.nodeId, child.element);
            }
            junior.set(current.nodeId, j);
        }
    }
    return [elders, junior, nodes];
}

export default function ({ root, notfound }: RouterProviderArgs) {
    let pathname = window.location.pathname;
    let currentPathId = pathname === '/' ? root.nodeId : pathname.replace(/\//g, '');
    let [pathId, setPathId] = useState(currentPathId);
    let [routerTree] = useState(() => genRouterTree(root));
    let [elders, junior, nodes] = routerTree;

    return <RouterContext.Provider value={{ pathId, navigate: setPathId, elders, junior }}>
        {nodes.get(pathId) ?? notfound ?? "404_not_found"}
    </RouterContext.Provider>
}