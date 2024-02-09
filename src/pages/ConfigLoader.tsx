import { useEffect } from "react";
import { ConfigCurrent, currentShow, isMain, listenEvents, registerSwitchDoAndUn } from "../core/runtime";
import { ReactDomWithChildren } from "./Layout";
import Offspring from "./Offspring";

interface ConfigLoaderArgs extends ReactDomWithChildren {
    config: ConfigCurrent
}

function DynamicStyle({ config, children }: ConfigLoaderArgs) {
    useEffect(() => {
        if (config.global_shortcut) {
            document.documentElement.style.setProperty('--color-xxx', 'black');
        }
        if (!isMain()) currentShow();
    }, [])
    return <>{children}</>
}

function GlobalShortcut({ config, children }: ConfigLoaderArgs) {
    const gsc = config.global_shortcut;
    useEffect(() => {
        // 在react严格模式下 useEffect 会执行两次 这里由于 await 时运行时会执行其他逻辑 导致函数整体非原子性 会连续注册两次
        let [doregister, unregister] = registerSwitchDoAndUn(gsc);
        let unlisten = listenEvents(
            ['do_global_shortcut', doregister],
            ['un_global_shortcut', unregister],
        )
        doregister();
        return () => {
            unlisten();
            unregister();
        }
    }, [])
    return <>{children}</>
}

export default function ({ config, children }: ConfigLoaderArgs) {
    return isMain() ?
        <DynamicStyle config={config}>
            <GlobalShortcut config={config}>{children}</GlobalShortcut>
        </DynamicStyle>
        :
        <DynamicStyle config={config}>
            <Offspring>{children}</Offspring>
        </DynamicStyle>
}