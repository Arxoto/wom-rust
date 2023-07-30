import { useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import constant from "../../constant";
import { Box, Head, Body } from "../Layout";
import { Item, ItemType, ItemDescriptor } from "./Item";
import runtime from "./runtime";
import './Wom.css'

const testItems: ItemDescriptor[] = [
    {
        theType: ItemType.Plugin,
        title: 'plugin',
        detail: '',
        actions: ['aaa', 'sss', 'ddd']
    },
    {
        theType: ItemType.Plugin,
        title: 'plugin',
        detail: '',
        actions: ['aaa', 'sss', 'ddd']
    },
    {
        theType: ItemType.Setting,
        title: 'UserSetting',
        detail: 'detail',
        actions: ['aaa', '阿木木', '阿松大']
    },
    {
        theType: ItemType.Cmd,
        title: 'cmd',
        detail: 'detail',
        actions: ['aaa', '阿木木', '阿松大']
    },
    {
        theType: ItemType.Cmd,
        title: 'cmd',
        detail: 'detail',
        actions: []
    },
    {
        theType: ItemType.Cmd,
        title: 'cmd',
        detail: 'detail',
        actions: ['aaa', 'sss', 'ddd']
    },
    {
        theType: ItemType.Web,
        title: 'web-web',
        detail: 'detail',
        actions: ['aaa', 'sss', 'ddd']
    },
    {
        theType: ItemType.Web,
        title: 'web-web',
        detail: 'detail',
        actions: ['aaa', 'sss', 'ddd']
    },
    {
        theType: ItemType.Web,
        title: 'web-web==============================================',
        detail: 'detail',
        actions: ['aaa', 'sss', 'ddd']
    },
    {
        theType: ItemType.Web,
        title: 'web-web==============================================',
        detail: 'detail',
        actions: []
    },
    {
        theType: ItemType.Folder,
        title: 'folder',
        detail: 'detail',
        actions: []
    },
    {
        theType: ItemType.Folder,
        title: 'folder',
        detail: 'detail',
        actions: []
    },
    {
        theType: ItemType.Folder,
        title: 'folder',
        detail: 'detail',
        actions: []
    },
    {
        theType: ItemType.Folder,
        title: 'folder',
        detail: 'detail',
        actions: []
    },
    {
        theType: ItemType.Application,
        title: 'app',
        detail: 'detail',
        actions: ['aaa', 'sss']
    },
    {
        theType: ItemType.Application,
        title: 'app',
        detail: 'detail',
        actions: ['aaa', 'sss']
    },
    {
        theType: ItemType.Application,
        title: 'app',
        detail: 'detail',
        actions: ['aaa', 'sss']
    },
    {
        theType: ItemType.Application,
        title: 'app',
        detail: 'detail',
        actions: ['aaa', 'sss']
    },
    {
        theType: "...",
        title: 'title',
        detail: 'detail',
        actions: ['aaa', 'sss', 'ddd']
    },
];

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
    const navigate = useNavigate();
    const [womTag, setWomTag] = useState(constant.wom_tag_default);
    const [selectItemIndex, setSelectItemIndex] = useState(0);
    const [items, setItems] = useState<ItemDescriptor[]>([]);

    const inputRef = useRef<HTMLInputElement>(null);
    function selectInput() {
        inputRef.current?.select();
    }
    runtime.whenOnfocus(selectInput);

    let sendLock = false;
    const doSearch = debounce(constant.doSearch_debounce, () => {
        if (sendLock) {
            return;
        }
        let imputValue = inputRef.current?.value || "";

        // get tiems
        let tmpItems: ItemDescriptor[];
        console.log(imputValue);
        if (imputValue.length % 2 === 0) {
            tmpItems = [];
        } else {
            tmpItems = testItems;
        }

        // show
        if (imputValue.length === 0) {
            setWomTag(constant.wom_tag_default);
        } else if (tmpItems.length === 0) {
            setWomTag(constant.wom_tag_notfound);
        } else {
            setWomTag(constant.wom_tag_hide)
        }
        setItems(tmpItems);
    })

    return (
        <Box>
            <Head>
                <div className='activable-text' onClick={() => navigate(constant.router_navigation)}>&gt;</div>
                <input className="common-color inputable wom-input"
                    type="text" placeholder={constant.wom_input_placeholder}
                    ref={inputRef}
                    onCompositionStart={() => { sendLock = true; }}
                    onCompositionEnd={() => { sendLock = false; }}
                    onInput={doSearch}
                />
                {womTag === constant.wom_tag_hide ?
                    <p className='common-box'>{selectItemIndex + 1}/{items.length}</p> :
                    <p className='common-box'>{womTag}</p>
                }
            </Head>
            <Body>
                {
                    items.map((item, index) => (
                        <Item
                            selected={index === selectItemIndex}
                            key={index}
                            theType={item.theType}
                            title={item.title}
                            detail={item.detail}
                            actions={item.actions}
                            trigger={item.trigger}
                        ></Item>
                    )
                    )
                }
            </Body>
        </Box>
    )
}