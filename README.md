# Browser Home Page

Small app to build a nice browser home page

# How to edit

There are two ways, either editing the TypeScript or the JavaScript file

Editing the JavaScript file is easier but the TypeScript IntelliSense won't work

Editing the TypeScript file provides IntelliSense but afterwards will need rebuilding

## Editing the JavaScript file

Pro | Con
---|---
no compiling needed | no TypeScript IntelliSense
1. open `dist/index.js`
2. edit:
    `const DEFAULT_HASH = "#Home";`
    and 
    `const PAGES = {
        ...
    };`

## Editing the TypeScript file

### Option 1 edit data.ts

Pros | Cons
---|---
TypeScript IntelliSense | needs building
different file for user specific data (easier to update) | needs Python or manual copy and pasting

1. open `personal/data.ts`
2. edit:
    `const DEFAULT_HASH = "#Home";`
    and 
    `const PAGES = {
        ...
    };`
4. run `include personal_data_ts in index_ts.py`
3. run `npm run build`

### Option 2 edit index.ts

Pro | Con
---|---
TypeScript IntelliSense | needs building

1. open `src/index.ts`
2. edit:
    `const DEFAULT_HASH = "#Home";`
    and 
    `const PAGES = {
        ...
    };`
3. run `npm run build`