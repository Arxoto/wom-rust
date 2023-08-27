/// 定义item及其触发方式

import { variables } from './env';
import { clipboardWriteText, formatPath, mainWindowHide, notify, shellOpen, shellSelect } from './runtime';
import { ItemState } from './womItem';
import { ItemType } from './womItemType';

/**
 * todo
 * - 设计持久化
 * - 配置页面
 * - 联调适配
 * - 去除调试输出
 */

/**
 * 根据item类型获取actions
 */
function actionsByType(itemType: string): string[] {
    switch (itemType) {
        case ItemType.Folder:
            return ['open', 'copy'];
        case ItemType.Application:
            return ['open', 'select', 'copy'];
        case ItemType.Plugin:
        case ItemType.Setting:
        case ItemType.Cmd:
        case ItemType.Web:
        default:
            return [];
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
            clipboardWriteText(path).catch(e => {
                console.error(e);
                notify(`cpoy ${path} failed`);
            });
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

async function triggerItem(item: ItemState, arg: string) {
    if (item.trigger) {
        item.trigger(item.actions[item.actionIndex], arg);
        mainWindowHide();
        return;
    }

    switch (item.theType) {
        case ItemType.Cmd:
            let args = arg.trim().split(/\s+/);
            let command = item.detail;
            for (let i = 0; i < args.length && command.includes(variables.input_replace); i++) {
                command.replace(variables.input_replace, args[i]);
            }
            clipboardWriteText(command).then(() => {
                shellOpen(variables.cmd_terminal).catch(e => {
                    console.error(e);
                    notify(`open ${variables.cmd_terminal} failed`);
                });
            }).catch(e => {
                console.error(e);
                notify(`cpoy ${command} failed`);
            });
            break;
        case ItemType.Web:
            let url = item.detail;
            // tauri 默认的路径校验规则
            if (new RegExp('^((mailto:\\w+)\|(tel:\\w+)\|(https?://\\w+)).+').test(url)) {
                let trueUrl = url.replace(variables.input_replace, arg);
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
            triggerFolder(item.actions[item.actionIndex], await formatPath(item.detail));
            break;
        case ItemType.Application:
            triggerApp(item.actions[item.actionIndex], await formatPath(item.detail));
            break;
        case ItemType.Setting:
        // todo
        case ItemType.Plugin:
        default:
            console.warn(`${item.title} has no trigger`);
            break;
    }
    mainWindowHide();
}

export { actionsByType, triggerItem };