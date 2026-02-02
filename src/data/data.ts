import loadURLsearchParams from "../loadURLsearchParams";
import type { T_DATA, T_MENU, T_SEARCH_PARAMS } from "../types";
import DataMenu from "./menu";

export default class Data {

    private menus: DataMenu[] = [];
    private searchParams: T_SEARCH_PARAMS;

    constructor(data: T_DATA) {
        data.forEach((d: T_MENU) => this.menus.push(new DataMenu(d)));
        this.searchParams = loadURLsearchParams()[0];
    }

    getMenus() {
        return this.menus;
    }

}