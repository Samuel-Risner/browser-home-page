import CONSTANTS from "../constants";
import type { T_DATA, T_IMG, T_MENU, T_URL_SEARCH_PARAMS } from "../types";
import DataMenu from "./menu";

export default class Data {

    private menus: DataMenu[] = [];

    /**
     * - img ID
     * - img base 64 encoded
    */
    private imgDB: T_IMG[] = [];
    private imgIDcount: number;

    private urlSearchParams: T_URL_SEARCH_PARAMS;
   
    /**
     * 
     * @param data <mull> will load data from local storage (if so specified in <urlSearchParams>) or will use the default value
     * @param urlSearchParams 
     */
    constructor(data: T_DATA, urlSearchParams: T_URL_SEARCH_PARAMS) {
        if (urlSearchParams.from === "local") {
            if (urlSearchParams.useLS) {
                const LSdata = localStorage.getItem(CONSTANTS.LS.DATA_KEY_LOCAL);
                if (LSdata === null) {
                    data = CONSTANTS.DEFAULT_VALUES.DATA;
                } else {
                    data = JSON.parse(LSdata);
                }
            } else {
                data = CONSTANTS.DEFAULT_VALUES.DATA;
            }
        }

        data[0].forEach((d: T_MENU) => this.menus.push(new DataMenu(d)));

        this.imgDB = data[1][1];
        this.imgIDcount = data[1][0];

        this.urlSearchParams = urlSearchParams;
    }

    save() {
        if (!this.urlSearchParams.useLS) return;
        if (this.urlSearchParams.from !== "local") return;

        localStorage.setItem(CONSTANTS.LS.DATA_KEY_LOCAL, this.getJSON());
    }

    /**
     * @returns the img ID
     */
    addImg(base64data: string): string {
        const id = String(this.imgIDcount);
        this.imgIDcount++;

        this.imgDB.push([id, base64data]);
        return String(id);
    }

    deleteImg(id: string) {
        for (let i = 0; i < this.imgDB.length; i++) {
            if (this.imgDB[i][0] === id) {
                this.imgDB.splice(i, 1);
                return;
            }
        }
    }

    //
    // - Getters
    //

    getMenus() {
        return this.menus;
    }

    getJSON(): string {
        const result: T_DATA = [
            this.menus.map(m => m.getJSON()),
            [
                this.imgIDcount,
                this.imgDB
            ]
        ];

        return JSON.stringify(result);
    }

    getBase64(id: string): string | null {
        for (let i = 0; i < this.imgDB.length; i++) {
            if (this.imgDB[i][0] === id) return this.imgDB[i][1];
        }

        return null;
    }

    getImgDB() {
        return this.imgDB;
    }

}