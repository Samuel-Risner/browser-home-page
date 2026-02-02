import type { T_TILE } from "../../types";

export default class DataTile {

    private name: string;
    private linkORcopy: "link" | "copy";
    private linkORtextToCopy: string;
    private imgID: number | null;

    constructor(data: T_TILE) {
        this.name = data[0];
        this.linkORcopy = data[1];
        this.linkORtextToCopy = data[2];
        this.imgID = data[3];
    }

    getName() {
        return this.name;
    }
}