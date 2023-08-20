import { WebviewWindow } from "@tauri-apps/api/window";
import { isRegistered, register, unregister } from "@tauri-apps/api/globalShortcut";
import constant from "./constant";

// import Database from "tauri-plugin-sql-api";

// // sqlite. The path is relative to `tauri::api::path::BaseDirectory::App`.
// const db = await Database.load("sqlite:test.db");

// // INSERT and UPDATE examples for sqlite and postgres
// const result = await db.execute(
//     "INSERT into todos (id, title, status) VALUES ($1, $2, $3)",
//     [todos.id, todos.title, todos.status],
// );

// todo 发现个BUG 摁下alt+space后识别摁下有残留 这时候再摁space会使用alt+space原有的功能（标题显示选项）（触发和不触发交替）  关闭decorations也无法规避
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