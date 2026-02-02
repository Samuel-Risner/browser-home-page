import type { T_SEARCH_PARAMS } from "./types";

function verifyChars(textToVerify: string): boolean {
    return /^[A-Za-z/]+$/.test(textToVerify);
}

/**
 * @returns finished parameters and a list with error messages
 */
export default function loadURLparams(): [T_SEARCH_PARAMS, string[]] {
    let finished_params: T_SEARCH_PARAMS = {
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

                case "src":
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
                
                case "encrypted":
                    if (value === "true") {
                        finished_params[param] = true;
                    } else if (value === "false") {
                        finished_params[param] = false;
                    } else {
                        errors.push("URL search parameter <encrypted> should be either <true> or <false>");
                    }

                    break;
                
                case "savePswd":
                    if (value === "true") {
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