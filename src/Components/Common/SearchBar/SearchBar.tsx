import React from 'react';
import './SearchBar.scss';

type SearchBarProps = {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  query: string;
}
const SearchBar = (props: SearchBarProps) => {
  return (
    <div className="searchContainer">
      <input
        type="text"
        name="songName"
        autoComplete="off"
        required
        value={props.query}
        onChange={props.onChange}
      />
      <label htmlFor="name" className="labelName">
        <span className="contentName">
          search
        </span>
      </label>
    </div>
  );
};

export default SearchBar;
