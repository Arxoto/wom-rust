// 基础依赖、三方件
import { useEffect, useReducer, useRef } from "react";
import { useNavigate } from 'react-router-dom';

// 常量、运行时函数、功能函数
import constant from "../../app/env";
import { debounce, whenfocus, whenkeydown } from "../../app/runtime";
import { parseInputValue, searchItems } from "./inputer";

// 自定义的全局变量和hook
import { womReducer } from "./womReducer";
import { defaultState, WomContext } from "./womContext";

// 自定义的组件
import { Box, Head, Body } from "../Layout";
import Item from "./Item";
import './Wom.css'

export default function () {
    const navigate = useNavigate();
    const [womState, dispatch] = useReducer(womReducer, defaultState);  // 使用 useReducer 替代 useState
    const input = womState.input;
    const items = womState.items;
    const currentIndex = womState.currentIndex;

    // useRef 与 useState 相同点：重新渲染不会导致信息丢失
    // useRef 与 useState 不同点：ref的值改变不会引起重新渲染
    // ref 操作 DOM ：定义 ref 后需在对应组件中赋值：ref={inputRef}  此时 ref 才真正有值
    const inputRef = useRef<HTMLInputElement>(null);
    /** 聚焦 input */
    function selectInput() {
        inputRef.current!.select();
    }

    // 每次组件渲染的时候都会执行的方法
    // 第一个入参：如何连接到外部系统，返回值：与该系统断开连接
    // 第二个入参为依赖项，表示仅当依赖项更新的时候才执行，若无则为每次渲染触发、若为空列表则为仅首次渲染触发
    // 注意需要：依赖的函数和对象须尽可能得少（闭包同样如此），这里以 useReducer && createContext 解决
    // 挂载键盘操作
    useEffect(() => {
        whenfocus(selectInput);

        whenkeydown((event) => {
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
                    dispatch({ type: 'left' });
                    break;
                case "ArrowRight":
                    dispatch({ type: 'right' });
                    break;
                case "Enter":
                    // handleTrigger
                    dispatch({ type: 'trigger' });
                    break;
                default:
                    break;
            }
        });

        return () => {
            whenfocus(null);
            whenkeydown(null);
        }
    }, []);

    // 每次输入更新 items  这里规避了输入法触发修改
    let sendLock = false;
    const searchLockOn = () => { sendLock = true; };
    const searchLockOff = () => { sendLock = false; };
    const doSearch = debounce(constant.doSearch_debounce, () => {
        if (sendLock) {
            return;
        }
        let inputValue = inputRef.current!.value ?? "";

        // get tiems
        let input = parseInputValue(inputValue);
        let tmpItems = searchItems(input);

        // show
        dispatch({ type: 'init', items: tmpItems, input });
    })

    // 根据 input 和 item 显示 tag
    let womTag;
    if (!input.hasVal) {
        womTag = constant.wom_tag_default;
    } else if (items.length === 0) {
        womTag = constant.wom_tag_notfound;
    } else {
        womTag = constant.wom_tag_hide;
    }

    // context 可能改变，结合 state ，传递给 provider
    // 下层组件通过 useContext 获取最近的值（中间层组件可以通过 provider 覆盖）
    // 如果没有覆盖则相当于全局变量
    return (
        <WomContext.Provider value={{ womState, dispatch }} >
            <Box>
                <Head>
                    <div className='activable-text' onClick={() => navigate(constant.router_navigation)}>&gt;</div>
                    <input className="common-color inputable wom-input"
                        type="text" placeholder={constant.wom_input_placeholder}
                        ref={inputRef}
                        onCompositionStart={searchLockOn}
                        onCompositionEnd={searchLockOff}
                        onInput={doSearch}
                    />
                    {womTag === constant.wom_tag_hide ?
                        <p className='common-box'>{currentIndex + 1}/{items.length}</p> :
                        <p className='common-box'>{womTag}</p>
                    }
                </Head>
                <Body>
                    {
                        items.map((item, index) => (
                            <Item
                                key={index}
                                selected={index === currentIndex}
                                item={item}
                                itemIndex={index}
                            ></Item>
                        )
                        )
                    }
                </Body>
            </Box>
        </WomContext.Provider>
    )
}