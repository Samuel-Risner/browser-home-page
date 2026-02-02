import type { T_IMG, T_IMGS } from "./types";

export default class ImageHandler {

    private imgIDcount: number;

    /**
     * - img ID
     * - img base 64 encoded
     */
    private imgDB: T_IMG[] = [];

    constructor(imgData: T_IMGS) {
        this.imgIDcount = imgData[0];
        this.imgDB = imgData[1];
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

    getImgDB() {
        return this.imgDB;
    }
}