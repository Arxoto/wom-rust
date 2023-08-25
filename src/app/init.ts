import { WebviewWindow } from "@tauri-apps/api/window";
import { isRegistered, register, unregister } from "@tauri-apps/api/globalShortcut";
import constant from "./env";

const setStyle = () => {
    // document.documentElement.style.setProperty(`--color-common-general`, 'blue');

    // 动态主题 todo cute-active cute-active-action cute-hover cute-hover-action
    let root = document.getElementById("root");
    if (root) {
      root.className = "cute-active cute-hover cute-hover-action";
    }
}

const refreshEnv = () => {
    // todo 发现个BUG 摁下alt后会切换至窗口按钮，此时摁下space会打开原生窗口自带的选项栏，和默认热键有冲突 关闭decorations也无法规避
    constant.globalShortcutKey = 'Shift+Space';
}

// electron:\shell\browser\api\electron_api_global_shortcut.h
const registerSwitch = async () => {
    if (await isRegistered(constant.globalShortcutKey)) return;
    register(constant.globalShortcutKey, async () => {
        const mainWindow = WebviewWindow.getByLabel('main');
        if (!mainWindow) {
            console.error('mainWindow is null');
            return;
        }
        if (await mainWindow.isVisible()) {
            mainWindow.hide();
        } else {
            mainWindow.show();
            mainWindow.setFocus();
        }
    }).then(() => {
        console.log("register!");
    }).catch(e => {
        console.log(e);
    });
};

const unregisterSwitch = async () => {
    if (!await isRegistered(constant.globalShortcutKey)) return;
    unregister(constant.globalShortcutKey).then(() => {
        console.log("unregister!");
    }).catch(e => {
        console.log(e);
    });
}

export { setStyle, refreshEnv, registerSwitch, unregisterSwitch }