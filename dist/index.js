const ROOT = document.getElementById("root");
const DEFAULT_HASH = "home";
const PAGE_ELEMENTS = {};
const NAVBAR_BTN_ELEMENTS = {};
const EDIT_ELEMENTS = [];
const INPUT_MENU_ROW = document.createElement("div");
const INPUT_MENU_TILE = document.createElement("div");
let DATA = {
    "home": {
        archive: false,
        rows: []
    },
};
let currentPage = DEFAULT_HASH;
let addRowData = "";
let addTileData = { pageKey: "", rowName: "" };
const tw = (tailwindCSS) => { return tailwindCSS; };
function encodeBase64Url(s) {
    return btoa(s)
        .replaceAll("+", "-")
        .replaceAll("/", "_");
}
function decodeBase64Url(b64url) {
    return atob(b64url
        .replaceAll("-", "+")
        .replaceAll("_", "/"));
}
function loadData() {
    const s = window.location.search;
    if (s !== "")
        DATA = JSON.parse(decodeBase64Url(s.slice(1)));
    const h = window.location.hash;
    if (DATA[h] === undefined) {
        currentPage = DEFAULT_HASH;
    }
    else {
        currentPage = h.slice(1);
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
        selectBtn.className = tw("bg-cyan-700 px-2 pt-1 pb-3 mr-0.5 hover:bg-cyan-800 hover:backdrop-opacity-65 disabled:bg-cyan-900");
        selectBtn.textContent = pageKey;
        selectBtn.disabled = pageKey === currentPage;
        selectBtn.onclick = () => {
            PAGE_ELEMENTS[currentPage].hidden = true;
            NAVBAR_BTN_ELEMENTS[currentPage].disabled = false;
            currentPage = pageKey;
            PAGE_ELEMENTS[currentPage].hidden = false;
            NAVBAR_BTN_ELEMENTS[currentPage].disabled = true;
        };
    }
}
function initInputMenuRow() {
    const inputEl = document.createElement("input");
    INPUT_MENU_ROW.appendChild(inputEl);
    inputEl.placeholder = "row name";
    const btn = document.createElement("button");
    INPUT_MENU_ROW.appendChild(btn);
    btn.textContent = "+";
    btn.onclick = () => {
        DATA[addRowData].rows.push({ name: inputEl.value, tiles: [] });
        updateUrl();
    };
}
function initInputMenuTiles() {
    const inputNameEl = document.createElement("input");
    INPUT_MENU_TILE.appendChild(inputNameEl);
    inputNameEl.placeholder = "tile name";
    const inputLinkEl = document.createElement("input");
    INPUT_MENU_TILE.appendChild(inputLinkEl);
    inputLinkEl.placeholder = "link";
    const inputFileEl = document.createElement("input");
    INPUT_MENU_TILE.appendChild(inputFileEl);
    inputFileEl.type = "file";
    inputFileEl.accept = "image/*";
    const btn = document.createElement("button");
    INPUT_MENU_TILE.appendChild(btn);
    btn.textContent = "+";
    btn.onclick = async () => {
        for (let i = 0; i < DATA[addTileData.pageKey].rows.length; i++) {
            const r = DATA[addTileData.pageKey].rows.at(i);
            if (r.name !== addTileData.rowName)
                continue;
            let icon = "";
            function fileToBase64(file) {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve((reader.result));
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
            r.tiles.push({ name: "inputNameEl.value", icon: "icon", link: "inputLinkEl.value" });
            updateUrl();
            break;
        }
    };
}
function initInputMenus() {
    ROOT.appendChild(INPUT_MENU_ROW);
    INPUT_MENU_ROW.hidden = true;
    initInputMenuRow();
    ROOT.appendChild(INPUT_MENU_TILE);
    INPUT_MENU_TILE.hidden = true;
    initInputMenuTiles();
}
function addTile(rowEl, tile) {
    const linkEl = document.createElement("a");
    rowEl.appendChild(linkEl);
    linkEl.className = tw("size-24 bg-gray-400 flex flex-col items-center justify-center");
    linkEl.target = "_blank";
    linkEl.href = tile.link;
    const iconContainerEL = document.createElement("div");
    linkEl.appendChild(iconContainerEL);
    iconContainerEL.className = tw("size-24 flex items-center justify-center p-2 bg-gray-200");
    const iconEl = document.createElement("img");
    iconContainerEL.appendChild(iconEl);
    iconEl.src = tile.icon;
    iconEl.className = tw("object-contain max-w-20 max-h-20");
    const descriptionEl = document.createElement("div");
    linkEl.appendChild(descriptionEl);
    descriptionEl.textContent = tile.name;
    descriptionEl.className = tw("text-sm flex items-center justify-center h-8 w-full");
}
function createAddRowBtn(pageEl, pageKey) {
    const btn = document.createElement("btn");
    EDIT_ELEMENTS.push(btn);
    pageEl.appendChild(btn);
    btn.textContent = "+";
    btn.className = tw("size-24 bg-gray-400 flex items-center justify-center");
    btn.onclick = () => {
        INPUT_MENU_ROW.hidden = false;
        addRowData = pageKey;
    };
}
function createAddTileBtn(rowEl, pageKey, rowName) {
    const btn = document.createElement("btn");
    EDIT_ELEMENTS.push(btn);
    rowEl.appendChild(btn);
    btn.textContent = "+";
    btn.className = tw("size-24 bg-gray-400 flex items-center justify-center");
    btn.onclick = () => {
        INPUT_MENU_TILE.hidden = false;
        addTileData = { pageKey: pageKey, rowName: rowName };
    };
}
function createPages() {
    for (let pageKey in DATA) {
        const pageEl = document.createElement("div");
        ROOT.appendChild(pageEl);
        PAGE_ELEMENTS[pageKey] = pageEl;
        pageEl.hidden = currentPage !== pageKey;
        pageEl.className = tw("flex flex-col p-4 gap-2");
        DATA[pageKey].rows.forEach((row) => {
            const rowEl = document.createElement("div");
            pageEl.appendChild(rowEl);
            rowEl.className = tw("flex gap-2");
            const rowNameEl = document.createElement("div");
            rowEl.appendChild(rowNameEl);
            rowNameEl.textContent = row.name;
            rowNameEl.className = tw("size-24 bg-gray-400 flex items-center justify-center");
            row.tiles.forEach((tile) => {
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
