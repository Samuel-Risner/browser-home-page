import type { T_DATA, T_MENU } from "../../types";
import DataMenu from "./menu";

export default class Data {

    private menus: DataMenu[] = [];

    constructor(data: T_DATA) {
        data.forEach((d: T_MENU) => this.menus.push(new DataMenu(d)));
    }

    getMenus() {
        return this.menus;
    }

}