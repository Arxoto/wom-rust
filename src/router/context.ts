import { ReactNode, createContext } from "react";

// default func  go to path
const navigate = (_: string) => { };
const elders = new Map<string, string[]>()
const nodes = new Map<string, ReactNode>();
export const RouterContext = createContext({ pathId: '', navigate, elders, nodes });
