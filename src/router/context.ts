import { createContext } from "react";

// default func  go to path
const df = (_: string) => { };
export const RouterContext = createContext({ navigate: df });
