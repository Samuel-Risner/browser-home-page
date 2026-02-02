import type { T_ROW, T_TAB } from "../../types";
import DataRow from "./row";

export default class DataTab {

    private name: string;
    private rows: DataRow[] = [];

    constructor(data: T_TAB) {
        this.name = data[0];
        data[1].forEach((d: T_ROW) => this.rows.push(new DataRow(d)));
    }

    addRow(name: string) {
        this.rows.push(new DataRow([name, []]));
    }

    setName(name: string) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    getRows() {
        return this.rows;
    }
}