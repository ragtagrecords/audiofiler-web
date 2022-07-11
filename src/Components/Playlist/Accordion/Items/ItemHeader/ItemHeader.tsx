import React from 'react';
import { Song } from 'Types';
import AddButton from 'Components/Playlist/Accordion/Items/ItemHeader/AddButton/AddButton';
import DownloadButton from 'Components/Playlist/Accordion/Items/ItemHeader/DownloadButton/DownloadButton';
import UploadButton from './UploadButton/UploadButton';
import OptionButton from './OptionButton/OptionButton';
import './ItemHeader.scss';

type ItemHeaderProps = {
  song: Song;
  isSelected: boolean;
  isBodyOpen: boolean;
  setIsBodyOpen: any;
  setBodyType: any;
  isUserAddingSongs: boolean;
  addSong: any;
  changeSong: any;
}

const AccordionItemHeader = ({
  song,
  isSelected,
  isBodyOpen,
  setIsBodyOpen,
  setBodyType,
  isUserAddingSongs,
  addSong,
  changeSong,
}: ItemHeaderProps) => {
  const username = localStorage.getItem('username');

  // Either show the add button or the upload button
  let left = null;
  if (username && isUserAddingSongs) {
    left = <AddButton addSong={addSong} songID={song.id ?? 0} />;
  } else if (username && isSelected) {
    left = <UploadButton setBodyType={setBodyType} setIsBodyOpen={setIsBodyOpen} />;
  }

  // Song name and a button to select the song and toggle body section
  const center = (
    <button
      type="button"
      className="accordionButton"
      onClick={() => {
        if (!isSelected) {
          changeSong(song);
        } else {
          setIsBodyOpen(!isBodyOpen);
        }
      }}
    ><span>{song.name}</span>
    </button>
  );

  let right = null;

  // If song is selected and user is authenticated, download and extra options
  if (isSelected && song.path && username) {
    right = (
      <>
        <DownloadButton
          href={song.path}
          fileName={song.path.split('/')[5]}
          key={`download-song-${song.id}`}
          setBodyType={setBodyType}
          setIsBodyOpen={setIsBodyOpen}
        />
        <OptionButton
          username={username}
          setBodyType={setBodyType}
          setIsBodyOpen={setIsBodyOpen}
        />
      </>
    );
  }

  return (
    <div className={`accordionHeader ${isSelected ? 'selected' : ''} ${isUserAddingSongs ? 'adding' : ''}`}>

      <div className="accordionHeaderSection left">
        {left}
      </div>

      <div className="accordionHeaderSection center">
        {center}
      </div>

      <div className="accordionHeaderSection right">
        {right}
      </div>
    </div>
  );
};

export default AccordionItemHeader;
