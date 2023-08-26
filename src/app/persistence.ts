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


/**
 * item持久化信息
 */
interface ItemPersistent {
    theType: string,
    title: string,
    detail: string,
}

interface ItemTable extends ItemPersistent {
    id: number
}

const itemsTableCreate = async () => await db!.execute("CREATE TABLE IF NOT EXISTS items (id INTEGER primary key AUTOINCREMENT, theType TEXT, title TEXT, detail TEXT)");
const itemsTableDrop = async () => await db!.execute("DROP TABLE IF EXISTS items");
const itemsSelect = async () => await db!.select(
    "SELECT * from items"
);
const itemsInsert = async (item: ItemPersistent) => await db!.execute(
    "INSERT into items (id, theType, title, detail) VALUES (NULL, $1, $2, $3)",
    [item.theType, item.title, item.detail]
);
const itemsUpdate = async (item: ItemTable) => await db!.execute(
    "UPDATE items SET theType = $1, title = $2, detail = $3 WHERE id = $4",
    [item.theType, item.title, item.detail, item.id]
);
const itemsDelete = async (id: number) => await db!.execute(
    "DELETE FROM items WHERE id = $1",
    [id]
)

export {
    dbInit, dbCleanup,
    itemsSelect, itemsInsert, itemsUpdate, itemsDelete,
};

export type { ItemPersistent, ItemTable };

