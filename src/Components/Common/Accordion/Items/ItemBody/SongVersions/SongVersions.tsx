import React, { useEffect, useState } from 'react';
import { Song } from 'Types';
import { getSongs } from 'Services/SongSvc';
import './SongVersions.scss';

type SongVersionsProps = {
  parentID: number;
  changeSong: any;
}

const SongVersions = ({ parentID, changeSong }: SongVersionsProps) => {
  const [songs, setSongs] = useState<Song[] | null>(null);

  const getSongVersions = async () => {
    const tempSongs = await getSongs(null, parentID.toString(10));
    if (!tempSongs) {
      console.log("Couldn't retrieve different versions of the parent song");
      return false;
    }
    setSongs(tempSongs);
    return true;
  };

  useEffect(() => {
    getSongVersions();
  }, []);

  if (songs) {
    return (
      <>
        <ul className="songVersionsList">
          {songs.map((song) => {
            return (
              <button
                type="button"
                onClick={() => {
                  changeSong(song, true);
                }}
                className="songVersionButton"
                key={`version-link-${song.id}`}
              >
                {song.name}
              </button>
            );
          })}
        </ul>
      </>
    );
  }

  return <div> No versions found</div>;
};

export default SongVersions;
