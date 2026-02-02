import type { T_MENU, T_TAB } from "../types";
import DataTab from "./tab";

export default class DataMenu {

    private name: string;
    private tabs: DataTab[] = [];

    constructor(data: T_MENU) {
        this.name = data[0];
        data[1].forEach((d: T_TAB) => this.tabs.push(new DataTab(d)));
    }

    addTab(name: string) {
        this.tabs.push(new DataTab([name, []]))
    }

    //
    // - Getters
    //

    getName() {
        return this.name;
    }

    getTabs() {
        return this.tabs;
    }
}