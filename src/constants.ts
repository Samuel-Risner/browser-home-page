import tw from "./tw";
import type { T_COLOR_SCHEME, T_DATA, T_URL_SEARCH_PARAMS } from "./types";

const DEFAULT_URL_SEARCH_PARAMS: T_URL_SEARCH_PARAMS = {
    from: "local",
    src: "",
    useLS: false,
    encrypted: false,
    savePswd: false
};

const CONSTANTS = {
    TWCSS: {
        menuBase: tw("fixed top-4 right-4 bg-gray-100 p-4 rounded-2xl flex flex-col w-45 gap-2"),
        input: tw("bg-gray-300 rounded-md pl-2"),
        tileSize: tw("w-20 h-20")
    },
    LS: {
        DATA_KEY_LOCAL: "__DATA_LOCAL__"
    },
    DEFAULT_VALUES: {
        DATA: [[["default menu", [["default tab", []]]]], [0, []]] as T_DATA,
        URL_SEARCH_PARAMS: DEFAULT_URL_SEARCH_PARAMS
    },
    PASSWORD: {
        MIN_LENGTH: 12,
        MAX_LENGTH: 64
    },
    COLOR_SCHEME: {
        DEFAULT: {
            bg: tw("bg-white")
        } as T_COLOR_SCHEME
    }
}

export default CONSTANTS;