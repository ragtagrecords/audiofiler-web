import React from 'react';
import plusButton from 'Assets/blue-plus.svg';
import './AddButton.scss';

type AddButtonProps = {
    href: string
}

const AddButton = (props: AddButtonProps) => {
  return (
    <a href={props.href}>
      <img alt="addButton" src={plusButton} className="addButton filterBlue" />
    </a>
  );
};

export default AddButton;
