import React from 'react';
import addButton from 'Assets/blue-plus.svg';
import './AddButton.scss';

type AddButtonProps = {
    songID: number;
    addSong: any;
}

const AddButton = ({ songID, addSong }: AddButtonProps) => {
  return (
    <button
      type="button"
      className="addButton"
      onClick={() => {
        addSong(songID);
      }}
    >
      <img
        alt="addButtonIcon"
        className="addButtonIcon"
        src={addButton}
      />
    </button>
  );
};

export default AddButton;
