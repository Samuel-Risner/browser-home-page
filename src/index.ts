import { textChangeRangeIsUnchanged } from "typescript";
import { T_PAGE, T_PAGES, T_ROW, T_TILE } from "./types";

const HTML_ELEMENTS = {
    ROOT: document.getElementById("root") as HTMLDivElement,
    PAGE_ELEMENTS: {} as { [key: string]: HTMLDivElement },
    NAVBAR_BTN_ELEMENTS: {} as { [key: string]: HTMLButtonElement },
    EDIT_ELEMENTS: [] as HTMLElement[],
}

const INPUT_MENUS = {
    PAGE: document.createElement("div"),
    ROW: document.createElement("div"),
    TILE: document.createElement("div"),
}

const INPUT_DATA = {
    row: "",
    tile: {
        pageKey: "",
        rowIndex: 0
    }
}

const LOCAL_STORADGE_KEYS = {
    defaultPage: ":defaultPage",
    data: ":data",
    imgKeysCount: ":imgKeyCount",
    savedImgKeys: ":savedImgKeys",
    imgDataPrefix: ":imgData:",
}

let DATA: T_PAGES = new Map();
let DEFAULT_HASH = "home";
let currentPage = DEFAULT_HASH;
DATA.set(DEFAULT_HASH, { rows: [] });

let imgKeyCount = 0;
let savedImgKeys: number[] = [0];
const imgData: Map<number, string> = new Map();
imgData.set(0, "");

const tw = (tailwindCSS: string) => { return tailwindCSS; }

function createEl<T extends keyof HTMLElementTagNameMap>(el: T, parent: HTMLElement, options: {
    style?: string;
    hidden?: boolean;
    txt?: string;
} = {}): HTMLElementTagNameMap[T] {
    const e = document.createElement(el);
    parent.appendChild(e);
    if (options.style) e.className = options.style;
    e.hidden = options.hidden || false;
    if (options.txt) e.textContent = options.txt;

    return e;
}

function loadData() {
    const d = localStorage.getItem(LOCAL_STORADGE_KEYS.data);

    if (d === null) {
        localStorage.setItem(LOCAL_STORADGE_KEYS.data, JSON.stringify([...DATA]));
    } else {
        DATA = new Map(JSON.parse(d));
    }

    const dh = localStorage.getItem(LOCAL_STORADGE_KEYS.defaultPage);
    if (dh !== null) DEFAULT_HASH = dh;

    const ikc = localStorage.getItem(LOCAL_STORADGE_KEYS.imgKeysCount);
    if (ikc === null) {
        localStorage.setItem(LOCAL_STORADGE_KEYS.imgKeysCount, JSON.stringify(imgKeyCount));
    } else {
        imgKeyCount = JSON.parse(ikc);
    }

    const sik = localStorage.getItem(LOCAL_STORADGE_KEYS.savedImgKeys);
    if (sik === null) {
        localStorage.setItem(LOCAL_STORADGE_KEYS.savedImgKeys, JSON.stringify(savedImgKeys));
    } else {
        savedImgKeys = JSON.parse(sik);
    }

    savedImgKeys.forEach((key: number) => {
        const d = localStorage.getItem(`${LOCAL_STORADGE_KEYS.imgDataPrefix}${key}`);
        if (d === null) return;
        imgData.set(key, d);
    });

    const h = window.location.hash;
    if (DATA.get(h) === undefined) {
        currentPage = DEFAULT_HASH;
    } else {
        currentPage = h.slice(1);
    }
}

function saveDataAndReload() {
    localStorage.setItem(LOCAL_STORADGE_KEYS.data, JSON.stringify([...DATA]));
    localStorage.setItem(LOCAL_STORADGE_KEYS.defaultPage, DEFAULT_HASH);
    localStorage.setItem(LOCAL_STORADGE_KEYS.imgKeysCount, JSON.stringify(imgKeyCount));
    localStorage.setItem(LOCAL_STORADGE_KEYS.savedImgKeys, JSON.stringify(savedImgKeys));

    window.location.href = window.location.href;
}

function addImg(img: string): number {
    imgKeyCount++;
    savedImgKeys.push(imgKeyCount);
    imgData.set(imgKeyCount, img);
    localStorage.setItem(`${LOCAL_STORADGE_KEYS.imgDataPrefix}${imgKeyCount}`, img);
    localStorage.setItem(LOCAL_STORADGE_KEYS.imgKeysCount, JSON.stringify(imgKeyCount));

    return imgKeyCount;
}

function createNavbar() {
    const navEl = document.createElement("div");
    HTML_ELEMENTS.ROOT.appendChild(navEl);
    navEl.className = tw("bg-cyan-500 p-2 pb-0");

    for (const pageKey of DATA.keys()) {
        const selectBtn = document.createElement("button");
        navEl.appendChild(selectBtn);
        HTML_ELEMENTS.NAVBAR_BTN_ELEMENTS[pageKey] = selectBtn;
        selectBtn.className = tw("bg-cyan-700 px-2 pt-1 pb-3 mr-0.5 hover:bg-cyan-800 hover:backdrop-opacity-65 disabled:bg-cyan-900")
        selectBtn.textContent = pageKey;
        selectBtn.disabled = pageKey === currentPage;

        selectBtn.onclick = () => {
            (HTML_ELEMENTS.PAGE_ELEMENTS[currentPage] as HTMLDivElement).hidden = true;
            (HTML_ELEMENTS.NAVBAR_BTN_ELEMENTS[currentPage] as HTMLButtonElement).disabled = false;
            currentPage = pageKey;
            (HTML_ELEMENTS.PAGE_ELEMENTS[currentPage] as HTMLDivElement).hidden = false;
            (HTML_ELEMENTS.NAVBAR_BTN_ELEMENTS[currentPage] as HTMLButtonElement).disabled = true;
        }
    }

    const addPageBtn = document.createElement("button");
    navEl.appendChild(addPageBtn);
    addPageBtn.textContent = "+";
    addPageBtn.onclick = () => {
        INPUT_MENUS.PAGE.hidden = false;
    }
}

function initInputMenus() {
    const inputStyle = tw("border-2 border-gray-300 px-2 mb-4");

    function initInputMenuPage() {
        const pageAlreadyExistsEl = createEl("div", INPUT_MENUS.PAGE, {hidden: true, style: tw("text-red-600")});

        const inputEl = createEl("input", INPUT_MENUS.PAGE, { style: inputStyle });
        inputEl.placeholder = "page name";

        inputEl.oninput = () => {
            if (DATA.get(inputEl.value) === undefined) {
                pageAlreadyExistsEl.hidden = true;
                return;
            }

            pageAlreadyExistsEl.hidden = false;
            pageAlreadyExistsEl.textContent = `Page "${inputEl.value}" already exists!`;
        }

        createEl("div", INPUT_MENUS.PAGE, { txt: "Select Position:" });
        const selectPosEl = createEl("select", INPUT_MENUS.PAGE, { hidden: DATA.size === 0, style: inputStyle });

        [...DATA.keys(), "at the end"].forEach((pageName, i) => {
            const option = document.createElement("option");
            option.value = `${i}`;
            option.textContent = `${i} (${pageName})`;
            selectPosEl.appendChild(option);
        })

        selectPosEl.value = `${DATA.size}`;
            
        const btn = createEl("button", INPUT_MENUS.PAGE, { txt: "+" });
        btn.onclick = () => {
            if (DATA.get(inputEl.value) !== undefined) return;

            let i = 0;
            const newData: T_PAGES = new Map();

            DATA.forEach((v, k) => {
                if (i === Number.parseInt(selectPosEl.value)) newData.set(inputEl.value, { rows: [] });
                newData.set(k, v);
                i++;
            });

            if (i === Number.parseInt(selectPosEl.value)) newData.set(inputEl.value, { rows: [] });
            
            DATA = newData;

            saveDataAndReload();
        }
    }

    function initInputMenuRow() {
        const inputEl = document.createElement("input");
        INPUT_MENUS.ROW.appendChild(inputEl);
        inputEl.placeholder = "row name";
        inputEl.className = inputStyle;
    
        const btn = document.createElement("button");
        INPUT_MENUS.ROW.appendChild(btn);
        btn.textContent = "+";
    
        btn.onclick = () => {
            (DATA.get(INPUT_DATA.row) as T_PAGE).rows.push({ name: inputEl.value, tiles: [] });
            saveDataAndReload();
        }
    }
    
    function initInputMenuTiles() {
        const inputNameEl = document.createElement("input");
        INPUT_MENUS.TILE.appendChild(inputNameEl);
        inputNameEl.placeholder = "tile name";
        inputNameEl.className = inputStyle;
    
        const inputLinkEl = document.createElement("input");
        INPUT_MENUS.TILE.appendChild(inputLinkEl);
        inputLinkEl.placeholder = "link";
        inputLinkEl.className = inputStyle;
    
        const inputFileEl = document.createElement("input");
        INPUT_MENUS.TILE.appendChild(inputFileEl);
        inputFileEl.type = "file";
        inputFileEl.accept = "image/*";
        inputFileEl.className = inputStyle;
    
        const btn = document.createElement("button");
        INPUT_MENUS.TILE.appendChild(btn);
        btn.textContent = "+";
        
        btn.onclick = async () => {
            for (let i = 0; i < (DATA.get(INPUT_DATA.tile.pageKey) as T_PAGE).rows.length; i++) {
                const r = ((DATA.get(INPUT_DATA.tile.pageKey) as T_PAGE).rows.at(i) as T_ROW);
                if (i !== INPUT_DATA.tile.rowIndex) continue;
    
                let icon = "";
    
                function fileToBase64(file: File): Promise<string> {
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve((reader.result) as string);
                        reader.onerror = reject;
                        reader.readAsDataURL(file);
                    });
                }
    
                const fileList = inputFileEl.files;
                if (fileList !== null) {
                    const f = fileList[0];
                    if (f !== undefined) {
                        const reader = new FileReader();
                        icon = await fileToBase64(f);
                        console.log(icon);
                    }
                }

                let iconKey = 0;
                if (icon !== "") iconKey = addImg(icon);
                r.tiles.push({name: inputNameEl.value, icon: iconKey, link: inputLinkEl.value });
                saveDataAndReload();
                break;
            }        
        }
    }

    const x: [HTMLElement, () => void][] = [
        [INPUT_MENUS.PAGE, initInputMenuPage],
        [INPUT_MENUS.ROW, initInputMenuRow],
        [INPUT_MENUS.TILE, initInputMenuTiles],
    ]
    
    for (let [menuEl, initFun] of x) {
        HTML_ELEMENTS.ROOT.appendChild(menuEl);
        menuEl.hidden = true;
        menuEl.className = tw("fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-400 grid grid-cols-1 p-4");
        initFun();
    }
}

function addTile(rowEl: HTMLDivElement, tile: T_TILE) {
    const linkEl = createEl("a", rowEl, { style: tw("size-24 bg-gray-400 flex flex-col items-center justify-center")});
    linkEl.target = "_blank";
    linkEl.href = tile.link;
    
    const iconContainerEL = createEl("div", linkEl, { style: tw("size-24 flex items-center justify-center p-2 bg-gray-200") });
    
    const iconEl = createEl("img", iconContainerEL, { style: tw("object-contain max-w-20 max-h-20") });
    iconEl.src = imgData.get(tile.icon) || "";
    
    createEl("div", linkEl, { txt: tile.name, style: tw("text-sm flex items-center justify-center h-8 w-full") });
}

function createAddRowBtn(pageEl: HTMLDivElement, pageKey: string) {
    const btn = createEl("button", pageEl, { txt: "+", style: tw("size-24 bg-gray-400 flex items-center justify-center") });
    HTML_ELEMENTS.EDIT_ELEMENTS.push(btn);

    btn.onclick = () => {
        INPUT_MENUS.ROW.hidden = false;
        INPUT_DATA.row = pageKey;
    }
}

function createAddTileBtn(rowEl: HTMLDivElement, pageKey: string, rowIndex: number) {
    const btn = createEl("button", rowEl, { txt: "+", style: tw("size-24 bg-gray-400 flex items-center justify-center") });
    HTML_ELEMENTS.EDIT_ELEMENTS.push(btn);

    btn.onclick = () => {
        INPUT_MENUS.TILE.hidden = false
        INPUT_DATA.tile = {
            pageKey: pageKey,
            rowIndex: rowIndex
        };
    }
}

function createPages() {
    DATA.forEach((pageData, pageKey) => {
        const pageEl = createEl("div", HTML_ELEMENTS.ROOT, { hidden: currentPage !== pageKey, style: tw("flex flex-col p-4 gap-2") });
        HTML_ELEMENTS.PAGE_ELEMENTS[pageKey] = pageEl;

        pageData.rows.forEach((row, i) => {
            const rowEl = createEl("div", pageEl, { style: tw("flex gap-2") });
            createEl("div", rowEl, { txt: row.name, style: tw("size-24 bg-gray-400 flex items-center justify-center") });
            
            row.tiles.forEach((tile: T_TILE) => {
                addTile(rowEl, tile);
            });

            createAddTileBtn(rowEl, pageKey, i);
        });
        
        createAddRowBtn(pageEl, pageKey);
    });
}

loadData();
createNavbar();
initInputMenus();
createPages();