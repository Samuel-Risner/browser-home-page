import { T_PAGES, T_PAGE } from "./types";

const DEFAULT_HASH = "#Home";

const PAGES: T_PAGES = {
    "#Home": {
        archive: false,
        rows: []
    },
}

const ROOT_ELEMENT = document.getElementById("root") as HTMLElement;
const PAGE_HTMLElements: { [key: string]: HTMLElement } = {};

let lastHash = DEFAULT_HASH;
let currentHash = DEFAULT_HASH;

function tw(tailwindCSS: string): string { return tailwindCSS; }

function loadCurrentHash() {
    currentHash = window.location.hash;

    if (currentHash === "") {
        currentHash = DEFAULT_HASH;
        window.location.hash = DEFAULT_HASH;
    }

    if (PAGES[currentHash] === undefined) {
        currentHash = DEFAULT_HASH;
        window.location.hash = DEFAULT_HASH;
    }
}

function createNavBar() {
    const navbar = document.createElement("div");
    ROOT_ELEMENT.appendChild(navbar);
    navbar.className = tw("bg-cyan-700 p-2 pb-0");

    const archiveNavbar = document.createElement("div");
    ROOT_ELEMENT.appendChild(archiveNavbar);
    archiveNavbar.className = navbar.className;

    let showArchiveNavbar = false;
    archiveNavbar.hidden = !showArchiveNavbar;

    const buttonClassName = tw("bg-cyan-700 px-2 pt-1 pb-3 mr-0.5 hover:bg-cyan-800 hover:backdrop-opacity-65 disabled:bg-cyan-900");

    const showArchiveNavbarButton = document.createElement("button");
    showArchiveNavbarButton.textContent = "<>";
    showArchiveNavbarButton.className = tw(`${buttonClassName} float-right`);

    showArchiveNavbarButton.onclick = () => {
        archiveNavbar.hidden = showArchiveNavbar;
        showArchiveNavbar = !showArchiveNavbar;
    }

    let disabledButton = showArchiveNavbarButton;

    for (let key in PAGES) {
        const button = document.createElement("button");
        button.textContent = key.slice(1);
        button.className = buttonClassName;

        if (key === currentHash) {
            disabledButton = button;
            button.disabled = true;
        }

        button.onclick = () => {
            window.location.hash = key;
            (disabledButton as HTMLButtonElement).disabled = false;
            button.disabled = true;
            disabledButton = button;

        }

        ((PAGES[key] as T_PAGE)["archive"])? archiveNavbar.appendChild(button) : navbar.appendChild(button);
    }

    if (archiveNavbar.children.length !== 0) navbar.appendChild(showArchiveNavbarButton);
}

function initializePages() {
    for (let pageKey in PAGES) {
        const page = document.createElement("div");
        page.hidden = true;
        ROOT_ELEMENT.appendChild(page);
        PAGE_HTMLElements[pageKey] = page;
        page.className = tw("flex flex-col p-4 gap-2");

        (PAGES[pageKey] as T_PAGE).rows.forEach((row) => {
            const rowContainer = document.createElement("div");
            (PAGE_HTMLElements[pageKey] as HTMLElement).appendChild(rowContainer);
            rowContainer.className = tw("flex gap-2");

            const rowNameDisplay = document.createElement("div");
            rowContainer.appendChild(rowNameDisplay);
            rowNameDisplay.textContent = row.name;
            rowNameDisplay.className = tw("size-24 bg-gray-400 flex items-center justify-center");

            row.tiles.forEach(tile => {
                let link: HTMLAnchorElement | HTMLButtonElement = document.createElement("a");
                
                if (tile.copy) {
                    link = document.createElement("button");
                    link.onclick = () => {
                        navigator.clipboard.writeText(tile.link);
                    }
                } else {
                    link.href = tile.link;
                    link.target = "_blank";
                }
                
                link.className = tw("w-24 h-32");
                rowContainer.appendChild(link);
                
                const iconContainer = document.createElement("div");
                link.appendChild(iconContainer);
                iconContainer.className = tw("size-24 flex items-center justify-center p-2 bg-gray-200");

                const icon = document.createElement("img");
                iconContainer.appendChild(icon);
                icon.src = tile.icon;
                icon.className = tw("object-contain max-w-20 max-h-20");

                const description = document.createElement("div");
                link.appendChild(description);
                description.textContent = tile.name;
                description.className = tw("text-sm flex items-center justify-center h-8 w-full");
            });
        })
    }
}

function changePage() {
    (PAGE_HTMLElements[lastHash] as HTMLElement).hidden = true;

    loadCurrentHash();

    const page = PAGES[currentHash];

    lastHash = currentHash;
    document.title = currentHash;
    (PAGE_HTMLElements[currentHash] as HTMLElement).hidden = false;
}

// For debuging
function checkUserInput() {
    // if "DEFAULT_HASH" is valid
    if (PAGES[DEFAULT_HASH] === undefined) console.warn(`The value for <DEFAULT_HASH> is invalid it should be one of the values from <PAGES> and not ${DEFAULT_HASH}`);
}

// checkUserInput();

loadCurrentHash();
createNavBar();
initializePages();
changePage();

addEventListener("hashchange", () => { changePage(); });