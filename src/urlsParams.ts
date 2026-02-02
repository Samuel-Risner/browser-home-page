function verifyChars(textToVerify: string): boolean {
    return /^[A-Za-z]+$/.test(textToVerify);
}

export default function loadURLparams() {
    console.log(window.location.search);

    let searchParamsString = window.location.search;

    if (!searchParamsString.startsWith("?")) return null;
    searchParamsString = searchParamsString.substring(1);

    let searchParamsList = searchParamsString.split("&");

    let searchParamsMap: Map<string, string> = new Map();
    searchParamsList.forEach(d => {
        let parts = d.split("=");
        if (parts.length !== 2) return;

        if (verifyChars(parts[0]) && verifyChars(parts[1])) {
            searchParamsList.
        }
    })
}