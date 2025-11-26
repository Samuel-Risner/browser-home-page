const HTML_ELEMENTS = {
    ROOT: document.getElementById("root"),
    PAGE_ELEMENTS: {},
    NAVBAR_BTN_ELEMENTS: {},
    EDIT_ELEMENTS: [],
};
const INPUT_MENUS = {
    PAGE: document.createElement("div"),
    showForTile: async (options) => { },
    ROW: document.createElement("div"),
    TILE: document.createElement("div"),
};
const INPUT_DATA = {
    row: "",
};
const LOCAL_STORAGE_KEYS = {
    defaultPage: ":defaultPage",
    data: ":data",
    imgKeysCount: ":imgKeyCount",
    savedImgKeys: ":savedImgKeys",
    imgDataPrefix: ":imgData:",
};
let DATA = new Map();
let DEFAULT_HASH = "home";
let currentPage = DEFAULT_HASH;
DATA.set(DEFAULT_HASH, { rows: [] });
let imgKeyCount = -1;
let savedImgKeys = [];
const imgData = new Map();
const tw = (tailwindCSS) => { return tailwindCSS; };
function createEl(el, parent, options = {}) {
    const e = document.createElement(el);
    parent.appendChild(e);
    if (options.style)
        e.className = options.style;
    e.hidden = options.hidden || false;
    if (options.txt)
        e.textContent = options.txt;
    if (options.isEditEl)
        HTML_ELEMENTS.EDIT_ELEMENTS.push(e);
    e.disabled = options.disabled || false;
    return e;
}
function handleData(mode) {
    const parts = [
        {
            LSKey: LOCAL_STORAGE_KEYS.data,
            LSreplace: JSON.stringify([...DATA]),
            loadFn: (localStorageValue) => { DATA = new Map(JSON.parse(localStorageValue)); },
            getStrToSave: () => { return JSON.stringify([...DATA]); }
        },
        {
            LSKey: LOCAL_STORAGE_KEYS.defaultPage,
            LSreplace: null,
            loadFn: (LSvalue) => { DEFAULT_HASH = LSvalue; },
            getStrToSave: () => { return DEFAULT_HASH; }
        },
        {
            LSKey: LOCAL_STORAGE_KEYS.imgKeysCount,
            LSreplace: JSON.stringify(imgKeyCount),
            loadFn: (LSvalue) => { imgKeyCount = JSON.parse(LSvalue); },
            getStrToSave: () => { return JSON.stringify(imgKeyCount); }
        },
        {
            LSKey: LOCAL_STORAGE_KEYS.savedImgKeys,
            LSreplace: JSON.stringify(savedImgKeys),
            loadFn: (LSValue) => { savedImgKeys = JSON.parse(LSValue); },
            getStrToSave: () => { return JSON.stringify(savedImgKeys); }
        }
    ];
    if (mode === "load") {
        parts.forEach((part) => {
            const d = localStorage.getItem(part.LSKey);
            if (d === null) {
                if (part.LSreplace !== null)
                    localStorage.setItem(part.LSKey, part.LSreplace);
            }
            else {
                part.loadFn(d);
            }
        });
        savedImgKeys.forEach((key) => {
            const d = localStorage.getItem(`${LOCAL_STORAGE_KEYS.imgDataPrefix}${key}`);
            if (d === null)
                return;
            imgData.set(key, d);
        });
        const h = window.location.hash;
        if (DATA.get(h) === undefined) {
            currentPage = DEFAULT_HASH;
        }
        else {
            currentPage = h.slice(1);
        }
    }
    else if (mode === "save" || mode === "save&refresh") {
        parts.forEach((part) => {
            localStorage.setItem(part.LSKey, part.getStrToSave());
        });
        if (mode === "save&refresh")
            window.location.href = window.location.href;
    }
}
function addImg(img) {
    imgKeyCount++;
    savedImgKeys.push(imgKeyCount);
    imgData.set(imgKeyCount, img);
    localStorage.setItem(`${LOCAL_STORAGE_KEYS.imgDataPrefix}${imgKeyCount}`, img);
    localStorage.setItem(LOCAL_STORAGE_KEYS.imgKeysCount, JSON.stringify(imgKeyCount));
    return imgKeyCount;
}
function createNavbar() {
    const navEl = createEl("div", HTML_ELEMENTS.ROOT, { style: tw("bg-cyan-500 p-2 pb-0") });
    for (const pageKey of DATA.keys()) {
        const selectBtn = createEl("button", navEl, { txt: pageKey, disabled: pageKey === currentPage, style: tw("bg-cyan-700 px-2 pt-1 pb-3 mr-0.5 hover:bg-cyan-800 hover:backdrop-opacity-65 disabled:bg-cyan-900") });
        HTML_ELEMENTS.NAVBAR_BTN_ELEMENTS[pageKey] = selectBtn;
        selectBtn.onclick = () => {
            HTML_ELEMENTS.PAGE_ELEMENTS[currentPage].hidden = true;
            HTML_ELEMENTS.NAVBAR_BTN_ELEMENTS[currentPage].disabled = false;
            currentPage = pageKey;
            HTML_ELEMENTS.PAGE_ELEMENTS[currentPage].hidden = false;
            HTML_ELEMENTS.NAVBAR_BTN_ELEMENTS[currentPage].disabled = true;
        };
    }
    // add page button
    createEl("button", navEl, { txt: "+" }).onclick = () => {
        INPUT_MENUS.PAGE.hidden = false;
    };
    // toggle edit element viability button
    createEl("button", navEl, { txt: "H" }).onclick = () => {
        HTML_ELEMENTS.EDIT_ELEMENTS.forEach((el) => { el.hidden = !el.hidden; });
        document.body.classList.contains("disable-links") ? document.body.classList.remove("disable-links") : document.body.classList.add("disable-links");
    };
}
function initInputMenus() {
    const inputStyle = tw("border-2 border-gray-300 px-2 mb-4");
    function initInputMenuPage() {
        // input page name
        const pageAlreadyExistsEl = createEl("div", INPUT_MENUS.PAGE, { hidden: true, style: tw("text-red-600") });
        const inputEl = createEl("input", INPUT_MENUS.PAGE, { style: inputStyle });
        inputEl.placeholder = "page name";
        inputEl.oninput = () => {
            if (DATA.get(inputEl.value) === undefined) {
                pageAlreadyExistsEl.hidden = true;
                return;
            }
            pageAlreadyExistsEl.hidden = false;
            pageAlreadyExistsEl.textContent = `Page "${inputEl.value}" already exists!`;
        };
        // select position
        createEl("div", INPUT_MENUS.PAGE, { txt: "Select Position:" });
        const selectPosEl = createEl("select", INPUT_MENUS.PAGE, { hidden: DATA.size === 0, style: inputStyle });
        [...DATA.keys(), "at the end"].forEach((pageName, i) => {
            const option = document.createElement("option");
            option.value = `${i}`;
            option.textContent = `${i} (${pageName})`;
            selectPosEl.appendChild(option);
        });
        selectPosEl.value = `${DATA.size}`;
        const btn = createEl("button", INPUT_MENUS.PAGE, { txt: "+" });
        btn.onclick = () => {
            if (DATA.get(inputEl.value) !== undefined)
                return;
            let i = 0;
            const newData = new Map();
            DATA.forEach((v, k) => {
                if (i === Number.parseInt(selectPosEl.value))
                    newData.set(inputEl.value, { rows: [] });
                newData.set(k, v);
                i++;
            });
            if (i === Number.parseInt(selectPosEl.value))
                newData.set(inputEl.value, { rows: [] });
            DATA = newData;
            handleData("save&refresh");
        };
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
            DATA.get(INPUT_DATA.row).rows.push({ name: inputEl.value, tiles: [] });
            handleData("save&refresh");
        };
    }
    function initInputMenuTiles() {
        // input name
        const inputNameEl = document.createElement("input");
        INPUT_MENUS.TILE.appendChild(inputNameEl);
        inputNameEl.placeholder = "tile name";
        inputNameEl.className = inputStyle;
        // input link
        const inputLinkEl = document.createElement("input");
        INPUT_MENUS.TILE.appendChild(inputLinkEl);
        inputLinkEl.placeholder = "link";
        inputLinkEl.className = inputStyle;
        // input img
        const inputFileEl = document.createElement("input");
        INPUT_MENUS.TILE.appendChild(inputFileEl);
        inputFileEl.type = "file";
        inputFileEl.accept = "image/*";
        inputFileEl.className = inputStyle;
        let selectedImgKey = null;
        let selectedImgButton = null;
        const selectAlreadySavedImgEl = createEl("div", INPUT_MENUS.TILE, { hidden: imgData.size === 0, style: inputStyle + tw(" flex flex-row") });
        imgData.forEach((value, key) => {
            const btn = createEl("button", selectAlreadySavedImgEl, { style: tw("w-10 h-10 disabled:w-10 disabled:h-10 disabled:border-4 disabled:border-red-500") });
            const img = createEl("img", btn);
            img.src = value;
            btn.onclick = () => {
                if (selectedImgButton)
                    selectedImgButton.disabled = false;
                selectedImgKey = key;
                selectedImgButton = btn;
                btn.disabled = true;
            };
        });
        inputFileEl.onclick = () => {
            if (selectedImgButton) {
                selectedImgButton.disabled = false;
                selectedImgButton = null;
                selectedImgKey = null;
            }
        };
        // btn to create/apply changes
        const btn = createEl("button", INPUT_MENUS.TILE);
        // return all the required data to create or edit a tile
        async function getData(pageKey, rowIndex) {
            let icon = "";
            let r = DATA.get(pageKey).rows.at(0);
            for (let i = 0; i < DATA.get(pageKey).rows.length; i++) {
                r = DATA.get(pageKey).rows.at(i);
                if (i !== rowIndex)
                    continue;
                if (selectedImgButton && selectedImgKey !== null) {
                    return { name: inputNameEl.value, icon: selectedImgKey, link: inputLinkEl.value, tiles: r.tiles };
                    // r.tiles.push({name: inputNameEl.value, icon: selectedImgKey, link: inputLinkEl.value });
                    // handleData("save&refresh");
                }
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
                    }
                }
                // r.tiles.push({name: inputNameEl.value, icon: iconKey, link: inputLinkEl.value });
                // handleData("save&refresh");
                break;
            }
            let iconKey = 0;
            if (icon !== "")
                iconKey = addImg(icon);
            return { name: inputNameEl.value, icon: iconKey, link: inputLinkEl.value, tiles: r.tiles };
        }
        INPUT_MENUS.showForTile = async (options) => {
            if (options.mode == "showForCreate") {
                btn.textContent = "+";
                btn.onclick = async () => { await INPUT_MENUS.showForTile({ mode: "create", pageKey: options.pageKey, rowIndex: options.rowIndex }); };
                INPUT_MENUS.TILE.hidden = false;
                return;
            }
            else if (options.mode == "showForEdit") {
                btn.textContent = "apply";
                btn.onclick = async () => { await INPUT_MENUS.showForTile({ mode: "edit", tileIndex: options.tileIndex, pageKey: options.pageKey, rowIndex: options.rowIndex }); };
                INPUT_MENUS.TILE.hidden = false;
                return;
            }
            const d = await getData(options.pageKey, options.rowIndex);
            if (options.mode == "create") {
                d.tiles.push({ name: d.name, icon: d.icon, link: d.link });
            }
            else if (options.mode == "edit") {
                d.tiles[options.tileIndex] = { name: d.name, icon: d.icon, link: d.link };
            }
            handleData("save&refresh");
        };
    }
    const x = [
        [INPUT_MENUS.PAGE, initInputMenuPage],
        [INPUT_MENUS.ROW, initInputMenuRow],
        [INPUT_MENUS.TILE, initInputMenuTiles],
    ];
    for (let [menuEl, initFun] of x) {
        HTML_ELEMENTS.ROOT.appendChild(menuEl);
        menuEl.hidden = true;
        menuEl.className = tw("fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-400 grid grid-cols-1 p-4");
        initFun();
    }
}
function addTile(rowEl, tile, tileIndex, pageKey, rowIndex) {
    const containerEl = createEl("div", rowEl, { style: tw("relative") });
    const linkEl = createEl("a", containerEl, { style: tw("size-24 bg-gray-400 flex flex-col relative items-center justify-center") });
    linkEl.target = "_blank";
    linkEl.href = tile.link;
    const iconContainerEL = createEl("div", linkEl, { style: tw("size-24 px-2 pt-2 flex items-center justify-center bg-gray-200") });
    const iconEl = createEl("img", iconContainerEL, { style: tw("object-contain max-w-20 max-h-16") });
    iconEl.src = imgData.get(tile.icon) || "";
    createEl("button", containerEl, { txt: ".", hidden: true, isEditEl: true, style: tw("bg-red-500 size-6 absolute -top-1 -right-1 rounded-full") }).onclick = () => {
        INPUT_MENUS.showForTile({ mode: "showForEdit", tileIndex: tileIndex, pageKey: pageKey, rowIndex: rowIndex });
    };
    createEl("div", linkEl, { txt: tile.name, style: tw("text-sm flex items-center justify-center h-8 w-full") });
}
function createAddRowBtn(pageEl, pageKey) {
    createEl("button", pageEl, { txt: "+", hidden: true, isEditEl: true, style: tw("size-24 bg-gray-400 flex items-center justify-center") }).onclick = () => {
        INPUT_MENUS.ROW.hidden = false;
        INPUT_DATA.row = pageKey;
    };
}
function createAddTileBtn(rowEl, pageKey, rowIndex) {
    createEl("button", rowEl, { txt: "+", hidden: true, isEditEl: true, style: tw("size-24 bg-gray-400 flex items-center justify-center") }).onclick = () => {
        INPUT_MENUS.showForTile({ mode: "showForCreate", pageKey: pageKey, rowIndex: rowIndex });
    };
}
function createPages() {
    DATA.forEach((pageData, pageKey) => {
        const pageEl = createEl("div", HTML_ELEMENTS.ROOT, { hidden: currentPage !== pageKey, style: tw("flex flex-col p-4 gap-2") });
        HTML_ELEMENTS.PAGE_ELEMENTS[pageKey] = pageEl;
        pageData.rows.forEach((row, i) => {
            const rowEl = createEl("div", pageEl, { style: tw("flex gap-2") });
            createEl("div", rowEl, { txt: row.name, style: tw("size-24 bg-gray-400 flex items-center justify-center") });
            row.tiles.forEach((tile, tileIndex) => {
                addTile(rowEl, tile, tileIndex, pageKey, i);
            });
            createAddTileBtn(rowEl, pageKey, i);
        });
        createAddRowBtn(pageEl, pageKey);
    });
}
handleData("load");
createNavbar();
initInputMenus();
createPages();
