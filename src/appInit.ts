import { WebviewWindow } from "@tauri-apps/api/window";
import { isRegistered, register, unregister } from "@tauri-apps/api/globalShortcut";
import constant from "./constant";

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

export { registerSwitch, unregisterSwitch }