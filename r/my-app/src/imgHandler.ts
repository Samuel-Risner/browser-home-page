import type { T_IMG, T_IMGS } from "./types";

export default class ImageHandler {

    private imgIDcount: number;

    /**
     * - img ID
     * - img base 64 encoded
     */
    private imgDB: T_IMG[] = [];
    // private imgDB: T_IMGS[1] = [];


    constructor(imgData: T_IMGS) {
        this.imgIDcount = imgData[0];
        this.imgDB = imgData[1];
    }

    /**
     * @returns the img ID
     */
    addImg(base64data: string): string {
        this.imgDB.push([String(this.imgIDcount), base64data]);
        this.imgIDcount++;
        return String(this.imgIDcount);
    }

    getImgDB() {
        return this.imgDB;
    }
}