import type { T_URL_SEARCH_PARAMS } from "../types";

function verifyChars(textToVerify: string): boolean {
    return /^[A-Za-z0-9.]+$/.test(textToVerify);
}

/**
 * @returns finished parameters and a list with error messages
 */
export default function loadURLsearchParams(): [T_URL_SEARCH_PARAMS, string[]] {
    let finished_params: T_URL_SEARCH_PARAMS = {
        from: "local",
        src: "",
        useLS: true,
        encrypted: false,
        savePswd: false
    }

    let errors: string[] = [];

    let searchParamsString = window.location.search;

    // remove leading "?"
    if (!searchParamsString.startsWith("?")) return [finished_params, []];
    searchParamsString = searchParamsString.substring(1);

    let searchParamsList = searchParamsString.split("&");

    searchParamsList.forEach(d => {
        let parts = d.split("=");
        if (parts.length !== 2) return;

        let param: string = parts[0];
        let value: string = parts[1];

        if (verifyChars(param) && verifyChars(value)) {
            switch (param) {
                case "from":
                    if (value === "local") {
                        finished_params[param] = "local";
                    } else if (value === "site") {
                        finished_params[param] = "site";
                    } else {
                        errors.push("URL search parameter <from> should be either <local> or <site>");
                    }

                    break;

                case "src": // Only if <from> is <site>
                    if (finished_params.from === "site") finished_params[param] = value;

                    break;

                case "useLS":
                    if (value === "true") {
                        finished_params[param] = true;
                    } else if (value === "false") {
                        finished_params[param] = false;
                    } else {
                        errors.push("URL search parameter <useLS> should be either <true> or <false>");
                    }

                    break;
                
                case "encrypted": // Only if <from> is <site>
                    if (finished_params.from === "site" && value === "true") {
                        finished_params[param] = true;
                    } else if (value === "false") {
                        finished_params[param] = false;
                    } else {
                        errors.push("URL search parameter <encrypted> should be either <true> or <false>");
                    }

                    break;
                
                case "savePswd": // Only if <encrypted> is <true>
                    if (finished_params.encrypted && value === "true") {
                        finished_params[param] = true;
                    } else if (value === "false") {
                        finished_params[param] = false;
                    } else {
                        errors.push("URL search parameter <savePswd> should be either <true> or <false>");
                    }

                    break;
            }
        }
    });

    return [finished_params, errors];
}