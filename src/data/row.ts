import type { T_ROW, T_TILE } from "../types";
import DataTile from "./tile";

export default class DataRow {

    private name: string;
    private tiles: DataTile[] = [];

    constructor(data: T_ROW) {
        this.name = data[0];
        data[1].forEach((d: T_TILE) => this.tiles.push(new DataTile(d)));
    }

    addTile(name: string, tileType: "link" | "copy", linkORtextToCopy: string, imgID: string | null) {
        this.tiles.push(new DataTile([name, tileType, linkORtextToCopy, imgID]));
    }

    //
    // - Getters
    //

    getName() {
        return this.name;
    }

    getTiles() {
        return this.tiles;
    }
}