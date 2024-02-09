import { useEffect, useReducer, useRef } from "react";

import { useNavigate } from "../../router/hooks";
import { womReducer } from "./WomReducer";
import { WomContext, defaultState } from "./womContext";
import { debounce, listenEvents, registerSwitchDoAndUn } from "../../core/runtime";
import { inputer, router } from "../../core/constants";
import { parseInput, searchItemsEx } from "../../core/womInputer";
import { Body, Box, Head } from "../Layout";

import Item from "./item/Item";
import "./Wom.css";

const TAG_DEFAULT = '';
const TAG_NOTFOUND = 'N/A';
const TAG_SHOWINDEX = '_';

export default function () {
    let nav = useNavigate();

    const [womState, dispatch] = useReducer(womReducer, defaultState);  // 使用 useReducer 替代 useState
    const input = womState.input;
    const items = womState.items;
    const currentIndex = womState.currentIndex;
    const version = womState.version;

    // useRef 与 useState 相同点：重新渲染不会导致信息丢失
    // useRef 与 useState 不同点：ref的值改变不会引起重新渲染
    // ref 操作 DOM ：定义 ref 后需在对应组件中赋值：ref={inputRef}  此时 ref 才真正有值
    const inputRef = useRef<HTMLInputElement>(null);
    /** 聚焦 input */
    const selectInput = () => {
        inputRef.current!.select();
    }

    // 每次组件渲染的时候都会执行的方法
    // 第一个入参：如何连接到外部系统，返回值：与该系统断开连接
    // 第二个入参为依赖项，表示仅当依赖项更新的时候才执行，若无则为每次渲染触发、若为空列表则为仅首次渲染触发
    // 注意需要：依赖的函数和对象须尽可能得少（闭包同样如此），这里以 useReducer && createContext 解决
    // 挂载键盘操作
    useEffect(() => {
        selectInput()
        window.onfocus = selectInput;
        window.onkeydown = (event) => {
            if (event.defaultPrevented) {
                return;
            }
            switch (event.key) {
                case "ArrowUp":
                    event.preventDefault();
                    dispatch({ type: 'up' });
                    break;
                case "ArrowDown":
                    event.preventDefault();
                    dispatch({ type: 'down' });
                    break;
                case "ArrowLeft":
                    dispatch({ type: 'left', reRender: true });
                    break;
                case "ArrowRight":
                    dispatch({ type: 'right', reRender: true });
                    break;
                case "Enter":
                    // handleTrigger
                    dispatch({ type: 'trigger' });
                    break;
                default:
                    break;
            }
        }

        // 在react严格模式下 useEffect 会执行两次 这里由于 await 时运行时会执行其他逻辑 导致函数整体非原子性 会连续注册两次
        let [doregister, unregister] = registerSwitchDoAndUn("Shift+Space");
        const unlisten = listenEvents(
            ['do_global_shortcut', doregister],
            ['un_global_shortcut', unregister],
        )
        doregister();

        return () => {
            window.onfocus = null;
            window.onkeydown = null;

            unlisten();
            unregister();
        }
    }, []);

    // 每次输入更新 items  这里规避了输入法触发修改
    let sendLock = false;
    const searchLockOn = () => { sendLock = true; };
    const searchLockOff = () => { sendLock = false; };
    const doSearch = debounce(inputer.doSearch_debounce, async () => {
        if (sendLock) {
            return;
        }
        let inputValue = inputRef.current!.value ?? "";

        // get tiems
        let input = parseInput(inputValue);
        let tmpItems = await searchItemsEx(input, inputValue);

        // show
        dispatch({ type: 'init', items: tmpItems, input });
    })

    // 根据 input 和 item 显示 tag
    let womTag;
    if (!input.hasInput) {
        womTag = TAG_DEFAULT;
    } else if (items.length === 0) {
        womTag = TAG_NOTFOUND;
    } else {
        womTag = TAG_SHOWINDEX;
    }

    return (
        <WomContext.Provider value={{ womState, dispatch }} >
            <Box>
                <Head>
                    <div className="a-txt" onClick={() => nav(router.navigation)}>&gt;</div>
                    <input type="text" className="wom-input"
                        ref={inputRef}
                        onCompositionStart={searchLockOn}
                        onCompositionEnd={searchLockOff}
                        onInput={doSearch}
                    />
                    <p className="head-text">{womTag === TAG_SHOWINDEX ? `${currentIndex + 1}/${items.length}` : womTag}</p>
                </Head>
                <Body>{
                    items.map((item, index) =>
                        <Item
                            key={index}
                            selected={index === currentIndex}
                            item={item}
                            itemIndex={index}
                            version={version}
                        ></Item>
                    )
                }</Body>
            </Box>
        </WomContext.Provider>
    );
}
