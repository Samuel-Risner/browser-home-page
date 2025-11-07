import { T_PAGE, T_PAGES, T_ROW, T_TILE } from "./types";

const ROOT = document.getElementById("root") as HTMLDivElement;
const DEFAULT_HASH = "home";
const PAGE_ELEMENTS: { [key: string]: HTMLDivElement } = {};
const NAVBAR_BTN_ELEMENTS: { [key: string]: HTMLButtonElement } = {};
const EDIT_ELEMENTS: HTMLElement[] = [];
const INPUT_MENU_ROW = document.createElement("div");
const INPUT_MENU_TILE = document.createElement("div");

let DATA: T_PAGES = {
    "home": {
        archive: false,
        rows: []
    },
};
let currentPage = DEFAULT_HASH;
let addRowData: string = "";
let addTileData: {pageKey: string, rowName: string } = { pageKey: "", rowName: "" };

const tw = (tailwindCSS: string) => { return tailwindCSS; }

function encodeBase64Url(s: string) {
    return btoa(s)
        .replaceAll("+", "-")
        .replaceAll("/", "_");
}

function decodeBase64Url(b64url: string) {
    return atob(b64url
        .replaceAll("-", "+")
        .replaceAll("_", "/")
    )
}

function loadData() {
    const s = window.location.search;
    if (s !== "") {
        const d = JSON.parse(decodeBase64Url(s.substring(1, s.length))) as T_PAGES;
        DATA = d;
    }

    const h = window.location.hash.slice(1);
    if (DATA[h] === undefined) {
        currentPage = DEFAULT_HASH;
    } else {
        currentPage = h;
    }
}

function updateUrl() {
    window.location.hash = currentPage;
    window.location.search = encodeBase64Url(JSON.stringify(DATA));
}

function createNavbar() {
    const navEl = document.createElement("div");
    ROOT.appendChild(navEl);
    navEl.className = tw("bg-cyan-500 p-2 pb-0");

    for (let pageKey in DATA) {
        const selectBtn = document.createElement("button");
        navEl.appendChild(selectBtn);
        NAVBAR_BTN_ELEMENTS[pageKey] = selectBtn;
        selectBtn.className = tw("bg-cyan-700 px-2 pt-1 pb-3 mr-0.5 hover:bg-cyan-800 hover:backdrop-opacity-65 disabled:bg-cyan-900")
        selectBtn.textContent = pageKey;
        selectBtn.disabled = pageKey === currentPage;

        selectBtn.onclick = () => {
            (PAGE_ELEMENTS[currentPage] as HTMLDivElement).hidden = true;
            (NAVBAR_BTN_ELEMENTS[currentPage] as HTMLButtonElement).disabled = false;
            currentPage = pageKey;
            (PAGE_ELEMENTS[currentPage] as HTMLDivElement).hidden = false;
            (NAVBAR_BTN_ELEMENTS[currentPage] as HTMLButtonElement).disabled = true;
        }
    }
}

function initInputMenuRow() {
    const inputEl = document.createElement("input");
    INPUT_MENU_ROW.appendChild(inputEl);
    inputEl.placeholder = "row name";

    const btn = document.createElement("button");
    INPUT_MENU_ROW.appendChild(btn);
    btn.textContent = "<>";

    btn.onclick = () => {
        (DATA[addRowData] as T_PAGE).rows.push({ name: inputEl.value, tiles: [] });
        updateUrl();
    }
}

function initInputMenuTiles() {
    const inputNameEl = document.createElement("input");
    INPUT_MENU_TILE.appendChild(inputNameEl);
    inputNameEl.placeholder = "tile name";

    const inputLinkEl = document.createElement("input");
    INPUT_MENU_TILE.appendChild(inputLinkEl);
    inputLinkEl.placeholder = "link";

    const btn = document.createElement("button");
    INPUT_MENU_TILE.appendChild(btn);
    btn.textContent = "<>";
    
    btn.onclick = () => {
        for (let i = 0; i < (DATA[addTileData.pageKey] as T_PAGE).rows.length; i++) {
            const r = ((DATA[addTileData.pageKey] as T_PAGE).rows.at(i) as T_ROW);
            if (r.name !== addTileData.rowName) continue;

            r.tiles.push({name: inputNameEl.value, icon: "icon", link: inputLinkEl.value });
            updateUrl();
            break;
        }        
    }
}

function initInputMenus() {
    ROOT.appendChild(INPUT_MENU_ROW);
    INPUT_MENU_ROW.hidden = true;
    initInputMenuRow();

    ROOT.appendChild(INPUT_MENU_TILE);
    INPUT_MENU_TILE.hidden = true;
    initInputMenuTiles();
}

function addTile(rowEl: HTMLDivElement, tile: T_TILE) {
    const linkEl = document.createElement("a");
    rowEl.appendChild(linkEl);
    linkEl.className = tw("size-24 bg-gray-400 flex items-center justify-center");
    linkEl.target = "_blank";
    
    const iconContainerEL = document.createElement("div");
    linkEl.appendChild(iconContainerEL);
    iconContainerEL.className = tw("size-24 flex items-center justify-center p-2 bg-gray-200");
    
    const iconEl = document.createElement("img");
    iconContainerEL.appendChild(iconEl);
    iconEl.src = tile.link;
    iconEl.className = tw("object-contain max-w-20 max-h-20");
    
    const descriptionEl = document.createElement("div");
    linkEl.appendChild(descriptionEl);
    descriptionEl.textContent = tile.name;
    descriptionEl.className = tw("text-sm flex items-center justify-center h-8 w-full")
}

function createAddRowBtn(pageEl: HTMLDivElement, pageKey: string) {
    const btn = document.createElement("btn");
    EDIT_ELEMENTS.push(btn);
    pageEl.appendChild(btn);
    btn.textContent = "+";
    btn.className = tw("size-24 bg-gray-400 flex items-center justify-center");

    btn.onclick = () => {
        INPUT_MENU_ROW.hidden = false;
        addRowData = pageKey;
    }
}

function createAddTileBtn(rowEl: HTMLDivElement, pageKey: string, rowName: string) {
    const btn = document.createElement("btn");
    EDIT_ELEMENTS.push(btn);
    rowEl.appendChild(btn);
    btn.textContent = "+";
    btn.className = tw("size-24 bg-gray-400 flex items-center justify-center");

    btn.onclick = () => {
        INPUT_MENU_TILE.hidden = false
        addTileData = { pageKey: pageKey, rowName: rowName };
    }
}

function createPages() {
    for (let pageKey in DATA) {
        const pageEl = document.createElement("div");
        ROOT.appendChild(pageEl);
        PAGE_ELEMENTS[pageKey] = pageEl;
        pageEl.hidden = currentPage !== pageKey;
        pageEl.className = tw("flex flex-col p-4 gap-2");
        
        (DATA[pageKey] as T_PAGE).rows.forEach((row: T_ROW) => {
            const rowEl = document.createElement("div");
            pageEl.appendChild(rowEl);
            rowEl.className = tw("flex gap-2");
            
            const rowNameEl = document.createElement("div");
            rowEl.appendChild(rowNameEl);
            rowNameEl.textContent = row.name;
            rowNameEl.className = tw("size-24 bg-gray-400 flex items-center justify-center");
            
            row.tiles.forEach((tile: T_TILE) => {
                addTile(rowEl, tile);
            });

            createAddTileBtn(rowEl, pageKey, row.name);
        });
        
        createAddRowBtn(pageEl, pageKey);
    }
}

loadData();
createNavbar();
initInputMenus();
createPages();