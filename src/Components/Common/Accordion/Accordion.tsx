import React, { useEffect, useState } from 'react';
import { Song } from 'Types';
import axios from 'axios';
import AccordionItem from './AccordionItem/AccordionItem';
import './Accordion.scss';
import SearchBar from '../SearchBar/SearchBar';

type AccordionProps = {
    songs: Array<Song>;
    onItemClick: any;
    newItemID: number;
    isAdding: boolean;
}

const Accordion = (props: AccordionProps) => {
  const firstItem = props.songs[0].id;
  const [currentItem, setCurrentItem] = useState<number>(firstItem);
  const [query, setQuery] = useState<string>('');
  const [allSongs, setAllSongs] = useState<Song[] | null>(null);
  const [filteredSongs, setFilteredSongs] = useState<Song[] | null>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleClick = (id: number) => {
    if (!id) {
      console.log('Failed to handle accordion click');
      return false;
    }
    setCurrentItem(id);
    props.onItemClick(id);
    return true;
  };

  useEffect(() => {
    setCurrentItem(props.songs[0].id);
  }, [props.songs]);

  useEffect(() => {
    setCurrentItem(props.newItemID);
  }, [props.newItemID]);

  useEffect(() => {
    const tempSongs: Song[] = [];
    // filter based on query
    if (allSongs) {
      allSongs.forEach((song) => {
        if (song.name.includes(query)) {
          tempSongs.push(song);
        }
      });
      setFilteredSongs(tempSongs);
    }
  }, [query]);

  useEffect(() => {
    console.log(filteredSongs);
  }, [filteredSongs]);

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
      setAllSongs(res.data);
      return true;
    }
    return false;
  };
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
              onChange={handleChange}
              query={query}
            />
          </div>
        </li>
        )}
        {props.songs && props.songs.map((song: Song) => {
          return (
            <AccordionItem
              show={currentItem === song.id}
              key={`accordion-item-${song.id}`}
              item={song}
              onItemClick={handleClick}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default Accordion;
