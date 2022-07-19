import React, { useContext } from 'react';
import LoadingSpinner from 'Components/Common/LoadingSpinner/LoadingSpinner';
import SearchBar from 'Components/Common/SearchBar/SearchBar';
import { PlaylistCtx } from 'Components/Playlist/PlaylistRoute';
import './Accordion.scss';

type AccordionProps = {
  children: React.ReactNode;
}

const Accordion = ({ children } : AccordionProps) => {
  const playlistContext = useContext(PlaylistCtx);
  if (!playlistContext) {
    return null;
  }
  const {
    playlist,
    isAdding,
    isLoading,
    query,
    handleQueryChange,
  } = playlistContext;

  if (isLoading) {
    return (
      <div className="accordionContainer">
        <LoadingSpinner />
      </div>
    );
  }

  if (playlist === null && !isAdding) {
    return <div className="accordionContainer"> No songs in this playlist yet, use three dots in upper right to add some</div>;
  }

  return (
    <div className="accordionContainer listContainer">
      <ul className="accordion">
        {isAdding && (
        <li className="searchItem">
          <div className="bar">
            <SearchBar
              onChange={handleQueryChange}
              query={query}
            />
          </div>
        </li>
        )}
        {children}
      </ul>
    </div>
  );
};

export default Accordion;
