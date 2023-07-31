import { useEffect, useRef, useState } from "react";
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

export default function () {
    const navigate = useNavigate();
    const [womTag, setWomTag] = useState(constant.wom_tag_default);
    const [items, setItems] = useState<ItemDescriptor[]>([]);
    const [selectItemIndex, setSelectItemIndex] = useState(0);
    const [selectActionIndex, setSelectActionIndex] = useState<number[]>([]);

    // 上下选中 item
    const safeStepItem = (nextIndex: number) => {
        if (nextIndex < 0) {
            setSelectItemIndex(items.length - 1);
        } else if (nextIndex >= items.length) {
            setSelectItemIndex(0);
        } else {
            setSelectItemIndex(nextIndex);
        }
    }
    // 左右选中 action
    const safeStepAction = (itemIndex: number) => {
        return (nextActionItem: number) => {
            const actionsLen = items[itemIndex].actions.length;
            if (!actionsLen) {
                return;
            }
            const maxIndex = actionsLen - 1;
            if (nextActionItem < 0) {
                nextActionItem = 0;
            } else if (nextActionItem > maxIndex) {
                nextActionItem = maxIndex;
            }
            setSelectActionIndex(selectActionIndex.map((ai, i) => {
                if (i !== itemIndex) {
                    return ai;
                }
                return nextActionItem;
            }));
        }
    }
    const tryActionLeft = () => {
        const actionsLen = items[selectItemIndex].actions.length;
        if (!actionsLen) {
            return false;
        }
        const oldActionIndex = selectActionIndex[selectItemIndex];
        if (oldActionIndex <= 0) {
            return false;
        }
        setSelectActionIndex(selectActionIndex.map((ai, i) => {
            if (i !== selectItemIndex) {
                return ai;
            }
            return oldActionIndex - 1;
        }));
        return true;
    }
    const tryActionRight = () => {
        const actionsLen = items[selectItemIndex].actions.length;
        if (!actionsLen) {
            return false;
        }
        const oldActionIndex = selectActionIndex[selectItemIndex];
        if (oldActionIndex >= actionsLen - 1) {
            return false;
        }
        setSelectActionIndex(selectActionIndex.map((ai, i) => {
            if (i !== selectItemIndex) {
                return ai;
            }
            return oldActionIndex + 1;
        }));
        return true;
    }

    // 聚焦 input
    const inputRef = useRef<HTMLInputElement>(null);
    function selectInput() {
        inputRef.current?.select();
    }

    // 挂载键盘操作
    useEffect(() => {
        runtime.whenfocus(selectInput);

        runtime.whenkeydown((event) => {
            if (event.defaultPrevented) {
                return;
            }
            switch (event.key) {
                case "ArrowUp":
                    event.preventDefault();
                    safeStepItem(selectItemIndex - 1);
                    break;
                case "ArrowDown":
                    event.preventDefault();
                    safeStepItem(selectItemIndex + 1);
                    break;
                case "ArrowLeft":
                    if (tryActionLeft()) { event.preventDefault(); }
                    break;
                case "ArrowRight":
                    if (tryActionRight()) { event.preventDefault(); }
                    break;
                default:
                    break;
            }
        });

        return () => {
            runtime.whenfocus(null);
            runtime.whenkeydown(null);
        }
    });

    // 更新 items
    let sendLock = false;
    const doSearch = runtime.debounce(constant.doSearch_debounce, () => {
        if (sendLock) {
            return;
        }
        let imputValue = inputRef.current?.value || "";

        // get tiems
        let tmpItems: ItemDescriptor[];
        console.log(imputValue);
        if (imputValue.length % 2 === 0 && imputValue.length < 5) {
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
        setSelectActionIndex(new Array(tmpItems.length).fill(0));
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
                            key={index}
                            theType={item.theType}
                            title={item.title}
                            detail={item.detail}
                            actions={item.actions}
                            trigger={item.trigger}
                            selected={index === selectItemIndex}
                            actionIndex={selectActionIndex[index]}
                            setIndex={safeStepAction(index)}
                        ></Item>
                    )
                    )
                }
            </Body>
        </Box>
    )
}