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
    variables.global_shortcut_key = 'Alt+Space';
}

const disableAltEvent = () => {
    window.addEventListener("keydown", event => {
        if (event.altKey) {
            event.preventDefault();
        }
    });
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

export { setStyle, refreshEnv, disableAltEvent, registerSwitch, unregisterSwitch }