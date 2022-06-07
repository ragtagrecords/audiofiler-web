import React from 'react';
import './SearchBar.scss';

const SearchBar = () => {
  return (
    <div className="searchContainer">
      <input type="text" name="songName" autoComplete="off" required />
      <label htmlFor="name" className="labelName">
        <span className="contentName">
          search
        </span>
      </label>
    </div>
  );
};

export default SearchBar;
