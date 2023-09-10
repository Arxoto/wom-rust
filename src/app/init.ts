import { WebviewWindow } from "@tauri-apps/api/window";
import { isRegistered, register, unregister } from "@tauri-apps/api/globalShortcut";
import { variables } from "./env";

const setStyle = () => {
    // document.documentElement.style.setProperty(`--color-common-general`, 'blue');

    // 动态主题 todo cute-active cute-active-action cute-hover cute-hover-action
    let root = document.getElementById("root");
    if (root) {
        root.className = "cute-active cute-active-action cute-hover";
    }
}

const refreshEnv = () => {
    // todo 发现个BUG 摁下alt后会切换至窗口按钮，此时摁下space会打开原生窗口自带的选项栏，和默认热键有冲突 关闭decorations也无法规避
    variables.global_shortcut_key = 'Shift+Space';
}

// electron:\shell\browser\api\electron_api_global_shortcut.h
const registerSwitch = async () => {
    if (await isRegistered(variables.global_shortcut_key)) return;
    register(variables.global_shortcut_key, async () => {
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
    if (!await isRegistered(variables.global_shortcut_key)) return;
    unregister(variables.global_shortcut_key).then(() => {
        console.log("unregister!");
    }).catch(e => {
        console.log(e);
    });
}

export { setStyle, refreshEnv, registerSwitch, unregisterSwitch }