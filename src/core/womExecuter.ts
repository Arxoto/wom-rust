/// 定义item的actions及其触发方式

import { inputer } from "./constants";
import { clipboardWriteText, clipboardWriteTextNotify, currentHide, notify, pageWebView, shellOpen, shellSelect, throttle } from "./runtime";
import { ItemExtend, ItemType } from "./womItem";


const a4oc = ['open', 'copy'];
const a4osc = ['open', 'select', 'copy'];
const a4empty: string[] = [];

/**
 * 根据特定类型获取其固定的动作
 */
const actions = (the_type: string) => {
    switch (the_type) {
        case ItemType.Folder:
            return a4oc;
        case ItemType.Files:
        case ItemType.App:
            return a4osc;
        default:
            return a4empty;
    }
}

/**
 * 触发action的相关执行逻辑
 */

function triggerApp(action: string, path: string) {
    if (action === 'select') {
        shellSelect(path);
    } else {
        triggerFolder(action, path);
    }
}

function triggerFolder(action: string, path: string) {
    switch (action) {
        case 'copy':
            clipboardWriteTextNotify(path);
            break;
        case 'open':
        default:
            shellOpen(path).catch(e => {
                console.error(e);
                notify(`open ${path} failed`);
            });
            break;
    }
}

async function triggerItem(item: ItemExtend, arg: string) {
    if (item.trigger) {
        item.trigger(item.action_list[item.action_index], arg);
        currentHide();
        return;
    }
    switch (item.the_type) {
        case ItemType.Cmd:
            let args = arg.trim().split(/\s+/);
            let command = item.detail;
            for (let i = 0; i < args.length && command.includes(inputer.args); i++) {
                command = command.replace(inputer.args, args[i]);
            }
            clipboardWriteText(command).catch(e => {
                console.error(e);
                notify(`cpoy ${command} failed`);
            });
            break;
        case ItemType.Web:
            let url = item.detail;
            // tauri 默认的路径校验规则
            if (new RegExp('^((mailto:\\w+)\|(tel:\\w+)\|(https?://\\w+)).+').test(url)) {
                let trueUrl = url.replace(inputer.args, arg);
                console.log(url, arg, trueUrl);

                shellOpen(trueUrl).catch(e => {
                    console.error(e);
                    notify(`open ${trueUrl} failed`);
                });
            } else {
                notify(`${url} not allowed`);
            }
            break;
        case ItemType.Folder:
            triggerFolder(item.action_list[item.action_index], item.detail);
            break;
        case ItemType.Files:
        case ItemType.App:
            triggerApp(item.action_list[item.action_index], item.detail);
            break;
        case ItemType.Page:
            pageWebView(item.title);
            break;
        default:
            console.warn(`${item.title} has no trigger`);
            break;
    }
}

// 可以防止 React.StrictMode 模式中触发两次
const safetyTrigger: (item: ItemExtend, arg: string) => void = throttle(200, triggerItem);

export { actions, safetyTrigger }