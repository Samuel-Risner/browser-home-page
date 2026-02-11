import CONSTANTS from "../constants";
import type { T_URL_SEARCH_PARAMS } from "../types";

function verifyChars(textToVerify: string): boolean {
    return /^[A-Za-z0-9.]+$/.test(textToVerify);
}

/**
 * @returns finished parameters and a list with error messages
 */
export default function loadURLsearchParams(): [T_URL_SEARCH_PARAMS, string[]] {
    let finished_params: T_URL_SEARCH_PARAMS = CONSTANTS.DEFAULT_VALUES.URL_SEARCH_PARAMS;

    let errors: string[] = [];
    let invalidParams: number = 0;

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

        if (!verifyChars(param)) {
            invalidParams++;
            return;
        }

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
                if (finished_params.from === "site") {
                    if (verifyChars(value)) {
                        finished_params[param] = value;
                        break;
                    }

                    errors.push("The value for the parameter <src> is invalid, value may only contain letters <a-z> and <A-Z>, numbers <0-9> and <.>");
                } else {
                    errors.push("URL search parameter <src> can only be used if the parameter <from> is equal to <site>");
                }

                break;

            case "useLS": // Only if <from> is <local>
                if (finished_params.from === "local") {
                    if (value === "true") {
                        finished_params[param] = true;
                    } else if (value === "false") {
                        finished_params[param] = false;
                    } else {
                        errors.push("URL search parameter <useLS> should be either <true> or <false>");
                    }
                } else {
                    errors.push("URL search parameter <useLS> can only be used if the parameter <from> is equal to <local>");
                }

                break;
            
            case "encrypted": // Only if <from> is <site>
                if (finished_params.from === "site") {
                    if (value === "true") {
                        finished_params[param] = true;
                    } else if (value === "false") {
                        finished_params[param] = false;
                    } else {
                        errors.push("URL search parameter <encrypted> should be either <true> or <false>");
                    }
                } else {
                    errors.push("URL search parameter <encrypted> can only be used if the parameter <from> is equal to <site>");
                }

                break;
            
            case "savePswd": // Only if <encrypted> is <true>
                if (finished_params.encrypted) {
                    if (value === "true") {
                        finished_params[param] = true;
                    } else if (value === "false") {
                        finished_params[param] = false;
                    } else {
                        errors.push("URL search parameter <savePswd> should be either <true> or <false>");
                    }
                } else {
                    errors.push("URL search parameter <savePswd> can only be used if the parameter <encrypted> is equal to <true>");
                }

                break;

            default:
                invalidParams++;
                break;
        }
    });

    if (invalidParams === 1) {
        errors.push("Invalid parameter, valid parameters are: <from> <src> <useLS> <encrypted> <savePswd>");
    } else if (invalidParams > 1) {
        errors.push(`${invalidParams} invalid parameters, valid parameters are: <from> <src> <useLS> <encrypted> <savePswd>`)
    }

    return [finished_params, errors];
}