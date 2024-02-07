import { useEffect, useState } from "react";
import { getCurrent } from "@tauri-apps/api/window";
import { listenEvents, registerSwitchDoAndUn } from "../../core/runtime";
import { configCurrent, configRuler, searchItem } from "../../core/invoker";
import Loading from "../Loading";

export default function () {
    useEffect(() => {
        console.log(getCurrent().label)

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

    const [greetMsg, setGreetMsg] = useState("");

    return (
        <div >
            <input
                placeholder="Enter ..."
                onInput={(event) => { setGreetMsg(event.currentTarget.value) }}
            />

            <p>{greetMsg}</p>

            <Loading/>
        </div>
    );
}
