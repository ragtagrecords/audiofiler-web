import React from 'react';
import { Song } from 'Types';
import AddButton from 'Components/Common/AddButton/AddButton';
import DownloadButton from 'Components/Common/DownloadButton/DownloadButton';
import UploadButton from './UploadButton/UploadButton';
import OptionButton from './OptionButton/OptionButton';
import './ItemHeader.scss';

type ItemHeaderProps = {
  song: Song;
  isSelected: boolean;
  isSelectedSongOpen: boolean;
  setIsSelectedSongOpen: any;
  isUserAddingSongs: boolean;
  addSong: any;
  handleClick: React.MouseEventHandler<HTMLButtonElement>;
  changeSong: any;
}

const AccordionItemHeader = ({
  song,
  isSelected,
  isSelectedSongOpen,
  setIsSelectedSongOpen,
  isUserAddingSongs,
  handleClick,
  addSong,
  changeSong,
}: ItemHeaderProps) => {
  const username = localStorage.getItem('username');
  return (
    <div className={`accordionHeader ${isSelected ? 'selected' : ''}`}>
      {/* show add button when adding songs */}
      <div className="accordionHeaderSection left">
        {isUserAddingSongs && (
        <AddButton
          addSong={addSong}
          songID={song.id ?? 0}
        />
        )}
        {isSelected
          && (
          <UploadButton
            handleClick={handleClick}
          />
          )}
      </div>

      {/* button to select the accordion song */}
      <div className="accordionHeaderSection center">
        <button
          type="button"
          className="accordionButton"
          onClick={() => {
            if (!isSelected) {
              changeSong(song);
            } else {
              setIsSelectedSongOpen(!isSelectedSongOpen);
            }
          }}
        ><span>{song.name}</span>
        </button>
      </div>
      {/* show extra buttons if song is selected */}
      <div className="accordionHeaderSection right">
        {isSelected && song.path && username
          && (
          <>
            <DownloadButton
              href={song.path}
              fileName={song.path.split('/')[5]}
              key={`download-song-${song.id}`}
              handleClick={handleClick}
            />
            <OptionButton
              username={username}
              handleClick={handleClick}
            />
          </>
          )}
      </div>
    </div>
  );
};

export default AccordionItemHeader;
