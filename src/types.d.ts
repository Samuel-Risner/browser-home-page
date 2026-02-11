export type T_DATA = [T_MENU[], T_IMGS];

/**
 * - menu name
 * - tabs
 */
export type T_MENU = [string, T_TAB[]];

/**
 * - tab name
 * - rows
 */
export type T_TAB = [string, T_ROW[]];

/**
 * - row name
 * - tiles
 */
export type T_ROW = [string, T_TILE[]];

/**
 * - tile name
 * - tile type
 * - link OR text to copy
 * - image ID (null for no image)
*/
export type T_TILE = [
    string,
    T_TILE_TYPE,
    string,
    string | null
];

export type T_TILE_TYPE = "link" | "copy";

export type T_IMGS = [number, T_IMG[]];

/**
 * - img ID
 * - img base64 encoded
 */
export type T_IMG = [
    string,
    string
];

export type T_URL_SEARCH_PARAMS = {
    from: "local" | "site",
    src: string,
    useLS: boolean,
    encrypted: boolean,
    savePswd: boolean
};