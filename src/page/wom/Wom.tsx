import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import constant from "../../constant";
import { Box, Head, Body } from "../Layout";
import { Item, ItemType, ItemDescriptor } from "./Item";
import './Wom.css'
import { ItemActionStatus } from "./ItemAction";

// 防抖 执行最后一次
function debounce(delay: number, fn: Function) {
    let timerId: number | undefined = undefined;
    return function (...args: any) {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            fn(...args);
            timerId = undefined;
        }, delay);
    }
}

export default function () {
    const items: ItemDescriptor[] = [
        {
            theType: ItemType.App,
            theKey: 'key',
            title: 'titlemmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm',
            detail: 'detail',
            action: { actionIndex: 0, actions: ['aaa', 'sss', 'ddd'] },
            trigger: (action, params) => { },
        },
        {
            theType: ItemType.Cmd,
            theKey: 'key',
            title: 'title',
            detail: '',
            action: { actionIndex: 0, actions: ['aaa', 'sss', 'ddd'] },
            trigger: (action, params) => { },
        },
        {
            theType: ItemType.Folder,
            theKey: 'key',
            title: 'titlemmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm',
            detail: 'detail',
            action: { actionIndex: 0, actions: [] },
            trigger: (action, params) => { },
        },
        {
            theType: ItemType.Tool,
            theKey: 'key',
            title: 'detail',
            detail: 'detail',
            action: { actionIndex: 0, actions: ['aaa', 'sss', 'ddd'] },
            trigger: (action, params) => { },
        },
        {
            theType: ItemType.Web,
            theKey: 'key',
            title: 'title',
            detail: 'detail',
            action: { actionIndex: 0, actions: ['aaa', 'sss', 'ddd'] },
            trigger: (action, params) => { },
        },
    ];

    const [womInput, setWomInput] = useState(constant.wom_input_default);
    const [womTag, setWomTag] = useState(constant.wom_tag_default);
    const navigate = useNavigate();
    return (
        <Box>
            <Head>
                <div className='activable-text' onClick={() => navigate(constant.router_navigation)}>&gt;</div>
                <input className="common-color inputable wom-input"
                    type="text" placeholder={constant.wom_input_placeholder}
                    ref={input => input?.focus()} 
                    />
                <p className='common-box'>{womTag}</p>
            </Head>
            <Body>
                {
                    items.map((item, index) => {
                        return (
                            <Item key={index} theType={item.theType} theKey={item.theKey} title={item.title} detail={item.detail} action={item.action} trigger={item.trigger}></Item>
                        )
                    })
                }
            </Body>
        </Box>
    )
}