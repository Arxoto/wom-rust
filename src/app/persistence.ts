import Database from "tauri-plugin-sql-api";
import { constants } from "./env";

let db: Database | undefined;

const dbInit = async () => {
    // sqlite. The path is relative to `tauri::api::path::BaseDirectory::App`.
    db = await Database.load(constants.db_name);
    await itemsTableCreate();
}

const dbCleanup = async () => {
    await itemsTableDrop();
}


interface Item {
    id?: number,
    theType: string,
    title: string,
    detail: string,
}

const itemsTableCreate = async () => await db!.execute("CREATE TABLE IF NOT EXISTS items (id INTEGER primary key AUTOINCREMENT, theType TEXT, title TEXT, detail TEXT)");
const itemsTableDrop = async () => await db!.execute("DROP TABLE IF EXISTS items");
const itemsList = async () => await db!.select("SELECT * from items");
const itemsInsert = async (item: Item) => await db!.execute(
    "INSERT into items (id, theType, title, detail) VALUES (NULL, $1, $2, $3)",
    [item.theType, item.title, item.detail]
);
const itemsUpdate = async (item: Item) => {
    if (!item.id) {
        return;
    }
    return await db!.execute(
        "UPDATE items SET theType = $1, title = $2, detail = $3 WHERE id = $4",
        [item.theType, item.title, item.detail, item.id]
    );
}

export {
    dbInit, dbCleanup,
    itemsList, itemsInsert, itemsUpdate
};

export type { Item };

