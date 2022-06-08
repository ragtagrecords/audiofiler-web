import React, { useEffect, useState } from 'react';
import { Song } from 'Types';
import axios from 'axios';
import AccordionItem from './AccordionItem/AccordionItem';
import './Accordion.scss';
import SearchBar from '../SearchBar/SearchBar';

type AccordionItemsProps = {
  playlistSongs: Song[];
  onItemClick: any;
  isAdding: boolean;
  currentItem: number;
  filteredSongs: Song[] | null;
}

const AccordionItems = (props: AccordionItemsProps) => {
  let accordionItems = null;
  if (!props.isAdding) {
    accordionItems = (
      <>
        {props.playlistSongs && props.playlistSongs.map((song: Song) => {
          return (
            <AccordionItem
              show={props.currentItem === song.id}
              key={`accordion-item-${song.id}`}
              item={song}
              onItemClick={props.onItemClick}
            />
          );
        })}
      </>
    );
  } else {
    accordionItems = (
      <>
        {props.filteredSongs && props.filteredSongs.map((song: Song) => {
          return (
            <AccordionItem
              show={props.currentItem === song.id}
              key={`accordion-item-${song.id}`}
              item={song}
              onItemClick={props.onItemClick}
            />
          );
        })}
      </>
    );
  }

  return accordionItems;
};

type AccordionProps = {
    playlistSongs: Song[];
    onItemClick: any;
    newItemID: number;
    isAdding: boolean;
}

const Accordion = (props: AccordionProps) => {
  const firstItem = props.playlistSongs[0].id;
  const [currentItem, setCurrentItem] = useState<number>(firstItem);
  const [query, setQuery] = useState<string>('');
  const [allSongs, setAllSongs] = useState<Song[] | null>(null);
  const [filteredSongs, setFilteredSongs] = useState<Song[] | null>(null);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const onItemClick = (id: number) => {
    if (!id) {
      console.log('Failed to handle accordion click');
      return false;
    }
    setCurrentItem(id);
    props.onItemClick(id);
    return true;
  };

  useEffect(() => {
    setCurrentItem(props.playlistSongs[0].id);
  }, [props.playlistSongs]);

  useEffect(() => {
    setCurrentItem(props.newItemID);
  }, [props.newItemID]);

  useEffect(() => {
    console.log(filteredSongs);
  }, [filteredSongs]);

  const filterSongs = (songs = null) => {
    // if allSongs not available yet, expect songs to be passed in param
    const tempSongs = allSongs ?? songs;
    if (!tempSongs) {
      console.log('Found no songs to filter!');
      return false;
    }
    console.log(tempSongs);
    const tempFilteredSongs: Song[] = [];

    console.log(props.playlistSongs);
    tempSongs.forEach((song) => {
      let isSongInPlaylist = false;
      let doesSongMatchQuery = false;

      props.playlistSongs.forEach((playlistSong) => {
        if (song.id < 120) {
          // console.log(`songID[${song.id}] | playlistSongID[${playlistSong.id}]`);
        }
        if (song.id === playlistSong.id) {
          isSongInPlaylist = true;
        }
      });

      doesSongMatchQuery = song.name.includes(query);

      if (!isSongInPlaylist && doesSongMatchQuery) {
        tempFilteredSongs.push(song);
      }
    });
    console.log('filtered songs');
    console.log(tempFilteredSongs);

    if (tempFilteredSongs.length > 0) {
      setFilteredSongs(tempFilteredSongs);
    }
    return true;
  };
  useEffect(() => {
    if (props.isAdding) {
      filterSongs();
    }
  }, [query]);

  const fetchSongs = async () => {
    let res;
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    try {
      res = await axios.get(
        `${baseUrl}public/songs`,
      );
    } catch (e) {
      return 0;
    }

    if (res.data) {
      // at first all and filtered are the same thing, we are filtering nothing
      setAllSongs(res.data);
      filterSongs(res.data);
      return true;
    }
    return false;
  };

  // fetch songs when the user decides to add songs
  useEffect(() => {
    if (props.isAdding) {
      fetchSongs();
    }
  }, [props.isAdding]);

  return (
    <div className="accordionContainer listContainer">
      <ul className="accordion">
        {props.isAdding
        && (
        <li className="searchItem">
          <div className="bar">
            <SearchBar
              onChange={handleQueryChange}
              query={query}
            />
          </div>
        </li>
        )}
        <AccordionItems
          playlistSongs={props.playlistSongs}
          onItemClick={onItemClick}
          isAdding={props.isAdding}
          currentItem={currentItem}
          filteredSongs={filteredSongs}
        />
      </ul>
    </div>
  );
};

export default Accordion;
