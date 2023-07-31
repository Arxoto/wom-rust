import { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import constant from "../../constant";
import { whenfocus, whenkeydown, debounce } from "./runtime";
import { ItemDescriptor } from "./executer";
import { searchItems } from "./inputer";
import { Box, Head, Body } from "../Layout";
import Item from "./Item";
import './Wom.css'

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
        whenfocus(selectInput);

        whenkeydown((event) => {
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
            whenfocus(null);
            whenkeydown(null);
        }
    });

    // 更新 items
    let sendLock = false;
    const doSearch = debounce(constant.doSearch_debounce, () => {
        if (sendLock) {
            return;
        }
        let inputValue = inputRef.current?.value || "";

        // get tiems
        console.log(inputValue);
        let tmpItems = searchItems(inputValue);


        // show
        if (inputValue.length === 0) {
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