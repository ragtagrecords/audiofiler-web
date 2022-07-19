import React from 'react';
import addButton from 'Assets/blue-plus.svg';
import './AddButton.scss';

type AddButtonProps = {
    onClick: any;
}

const AddButton = ({ onClick }: AddButtonProps) => {
  return (
    <button
      type="button"
      className="addButton"
      onClick={onClick}
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
