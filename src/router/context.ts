import { createContext } from "react";

// default func  go to path
const navigate = (_: string) => { };
const elders = new Map<string, string[]>();
const junior = new Map<string, string[]>();
export const RouterContext = createContext({ pathId: '', navigate, elders, junior });
