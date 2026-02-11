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
   
    constructor(data: T_DATA, urlSearchParams: T_URL_SEARCH_PARAMS) {
        data[0].forEach((d: T_MENU) => this.menus.push(new DataMenu(d)));

        this.imgDB = data[1][1];
        this.imgIDcount = data[1][0];

        this.urlSearchParams = urlSearchParams;
    }

    save() {
        if (!this.urlSearchParams.useLS) return;
        if (this.urlSearchParams.from === "local") localStorage.setItem(CONSTANTS.LS.DATA_KEY_LOCAL, this.getJSON());
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