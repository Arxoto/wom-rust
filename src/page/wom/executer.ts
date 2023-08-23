/// 定义item及其触发方式

// web file no args
import { open } from '@tauri-apps/api/shell';
import { writeText } from '@tauri-apps/api/clipboard';
import { appCacheDir, appConfigDir, appDataDir, appLocalDataDir, appLogDir, audioDir, cacheDir, configDir, dataDir, desktopDir, documentDir, downloadDir, executableDir, fontDir, homeDir, join, localDataDir, pictureDir, publicDir, resourceDir, runtimeDir, templateDir, videoDir } from '@tauri-apps/api/path';
import { notify } from "./runtime";
import constant from '../../constant';
import { WebviewWindow } from '@tauri-apps/api/window';

/**
 * todo
 * - 设计持久化
 * - 配置页面
 * - 联调适配
 */

enum ItemType {
    Plugin = "plugin",      // 内置工具
    Setting = "setting",    // 设置
    Cmd = "cmd",            // 命令行
    Web = "web",            // 网页
    Folder = "folder",      // 文件夹
    Application = "app",    // 应用
}

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
 * item持久化信息
 */
interface ItemPersistent {
    theType: ItemType | string,
    title: string,
    detail: string,
}

/**
 * item描述符
 * - 增加了actions和可选的自定义触发方法
 * - 一般内置的item实现该接口
 */
interface ItemDescriptor extends ItemPersistent {
    actions: string[],
    trigger?: (action: string, arg: string) => void,
}

/**
 * item运行时状态
 * - 增加了action的显示索引
 */
interface ItemState extends ItemDescriptor {
    actionIndex: number
}

/**
 * 特殊路径转换
 * @param uri 包含特定目录标识的相对路径，格式：{特定目录}|{相对路径}
 * @returns 真正的路径
 */
async function formatPath(uri: string) {
    let [root, ps] = uri.split('|', 2);
    let pp: string;
    switch (root) {
        case 'appCacheDir': pp = await appCacheDir(); break;
        case 'appConfigDir': pp = await appConfigDir(); break;
        case 'appDataDir': pp = await appDataDir(); break;
        case 'appLocalDataDir': pp = await appLocalDataDir(); break;
        case 'appLogDir': pp = await appLogDir(); break;
        case 'audioDir': pp = await audioDir(); break;
        case 'cacheDir': pp = await cacheDir(); break;
        case 'configDir': pp = await configDir(); break;
        case 'dataDir': pp = await dataDir(); break;
        case 'desktopDir': pp = await desktopDir(); break;
        case 'documentDir': pp = await documentDir(); break;
        case 'downloadDir': pp = await downloadDir(); break;
        case 'executableDir': pp = await executableDir(); break;
        case 'fontDir': pp = await fontDir(); break;
        case 'homeDir': pp = await homeDir(); break;
        case 'localDataDir': pp = await localDataDir(); break;
        case 'pictureDir': pp = await pictureDir(); break;
        case 'publicDir': pp = await publicDir(); break;
        case 'resourceDir': pp = await resourceDir(); break;
        case 'runtimeDir': pp = await runtimeDir(); break;
        case 'templateDir': pp = await templateDir(); break;
        case 'videoDir': pp = await videoDir(); break;
        default:
            return uri;
    }
    return join(pp, ps);
}

const allowedFormatPath = [
    'appCacheDir',
    'appConfigDir',
    'appDataDir',
    'appLocalDataDir',
    'appLogDir',
    'audioDir',
    'cacheDir',
    'configDir',
    'dataDir',
    'desktopDir',
    'documentDir',
    'downloadDir',
    'executableDir',
    'fontDir',
    'homeDir',
    'localDataDir',
    'pictureDir',
    'publicDir',
    'resourceDir',
    'runtimeDir',
    'templateDir',
    'videoDir',
];

function triggerApp(action: string, path: string) {
    if (action === 'select') {
        // todo SHOpenFolderAndSelectItems or open when failed
    } else {
        triggerFolder(action, path);
    }
}

function triggerFolder(action: string, path: string) {
    switch (action) {
        case 'copy':
            writeText(path).catch(e => {
                console.error(e);
                notify(`cpoy ${path} failed`);
            });
            break;
        case 'open':
        default:
            open(path).catch(e => {
                console.error(e);
                notify(`open ${path} failed`);
            });
            break;
    }
}

async function triggerItem(item: ItemState, arg: string) {
    if (item.trigger) {
        item.trigger(item.actions[item.actionIndex], arg);
        WebviewWindow.getByLabel('main')?.hide();
        return;
    }

    switch (item.theType) {
        case ItemType.Cmd:
            let args = arg.trim().split(/\s+/);
            let command = item.detail;
            for (let i = 0; i < args.length && command.includes(constant.input_replace); i++) {
                command.replace(constant.input_replace, args[i]);
            }
            writeText(command).then(() => {
                open(constant.cmd_terminal).catch(e => {
                    console.error(e);
                    notify(`open ${constant.cmd_terminal} failed`);
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
                let trueUrl = url.replace(constant.input_replace, arg);
                console.log(url, arg, trueUrl);

                open(trueUrl).catch(e => {
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
    WebviewWindow.getByLabel('main')?.hide();
}

export { ItemType, actionsByType, formatPath, allowedFormatPath, triggerItem };
export type { ItemPersistent, ItemDescriptor, ItemState };
