import React from 'react';
import addButton from 'Assets/blue-plus.svg';
import './AddButton.scss';

type AddButtonProps = {
    songID: number;
    onClick: any;
}

const AddButton = (props: AddButtonProps) => {
  return (
    <button
      type="button"
      className="addButton"
      onClick={props.onClick.bind(null, props.songID)}
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
