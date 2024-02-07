import { useEffect } from "react";
import { getCurrent } from "@tauri-apps/api/window";
import { listenEvents, registerSwitchDoAndUn } from "../../core/runtime";
import { configCurrent, configRuler, searchItem } from "../../core/invoker";
import { Body, Box, Head } from "../Layout";
import { useNavigate } from "../../router/hooks";
import { router } from "../../core/constants";
import "./Wom.css";

export default function () {
    let nav = useNavigate();
    useEffect(() => {
        console.log(getCurrent().label)

        setTimeout(() => {
            nav('asd')
        }, 5000);

        configRuler()
            .then((res) => console.log('config_ruler: ', res))
            .catch((e) => console.error(e))
        configCurrent()
            .then((res) => console.log('config_current: ', res))
            .then(() => configCurrent()
                .then((res) => console.log('config_current: ', res))
            )
            .catch((e) => console.error(e))
        // todo reset window size and center
        searchItem("wt", false)
            .then((res) => console.log('search_item: ', res))
            .catch((e) => console.error(e))

        // 在react严格模式下 useEffect 会执行两次 这里由于 await 时运行时会执行其他逻辑 导致函数整体非原子性 会连续注册两次
        let [doregister, unregister] = registerSwitchDoAndUn("Shift+Space");
        const unlisten = listenEvents(
            ['do_global_shortcut', doregister],
            ['un_global_shortcut', unregister],
        )
        doregister();

        return () => {
            unlisten();
            unregister();
        }
    }, []);

    return (
        <Box>
            <Head>
                <div className="a-txt" onClick={() => nav(router.navigation)}>&gt;</div>
                <input type="text" className="wom-input" />
                <p className="head-text"></p>
            </Head>
            <Body>asd</Body>
        </Box>
    );
}
