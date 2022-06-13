export type Playlist = {
    id: number;
    name: string;
};

export interface Song {
    id?: number;
    name: string;
    path: string;
    tempo?: number;
    artist?: string;
    zipPath?: string;
    isParent?: boolean;
    parentID?: number;
};

export type MenuOption = {
    href: string;
    text: string;
    state?: any;
    onClick?: any;
}

// Update this to extend Song
export type SongInputInfo = {
    name: string,
    file?: File,
    fileName: string,
    tempo?: number,
    parentID?: number;
    playlistIDs?: Array<string>,
    zipFileName?: string,
}

export interface UploadedSongInfo {
    file: File;
    name: string;
    parentSong: Song;
    isMainVersion: boolean;
  }

// Used for accordion body
export type BodyType = 'info' | 'versions' | 'upload' | 'download' | 'collapsed';
