export type T_DATA = T_MENU[];

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

export type T_TILE_TYPE = "link" | "copy";

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

/**
 * - img ID
 * - img base64 encoded
 */
export type T_IMG = [
    string,
    string
];

export type T_IMGS = [number, T_IMG[]];