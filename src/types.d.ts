export type T_TILE = {
    copy?: true,
    name: string,
    icon: number,
    link: string,
}

export type T_ROW = {
    name: string,
    tiles: T_TILE[]
}

export type T_PAGE = {
    archive?: boolean,
    rows: T_ROW[]
}

export type T_PAGES = Map<string, T_PAGE>