export type Playlist = {
  id: string;
  name: string;
};

export interface Song {
  id?: number;
  name: string;
  file?: File;
  fileName?: string;
  zipFile?: File;
  zipFileName?: string;
  path?: string;
  tempo?: string | number;
  artist?: string;
  zipPath?: string;
  isParent?: boolean;
  parentID?: number | null;
  playlistIDs?: Array<string> | null;
}

export type MenuOption = {
  href: string;
  text: string;
  state?: any;
  onClick?: any;
}

// Used for accordion body
export type BodyType = 'info' | 'versions' | 'upload' | 'download' | 'collapsed';
