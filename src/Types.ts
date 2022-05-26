export type Playlist = {
    id: number;
    name: string;
};

export type Song = {
    id: number;
    name: string;
    path?: string;
    tempo?: number;
    artist?: string;
};
