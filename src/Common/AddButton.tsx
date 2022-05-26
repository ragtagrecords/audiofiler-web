import React from 'react';
import './AddButton.scss';
import plusButton from '../Assets/blue-plus.png';

type AddButtonProps = {
    href: string
}

const AddButton = (props: AddButtonProps) => {
  return (
    <a href={props.href}>
      <img alt="addButton" src={plusButton} />
    </a>
  );
};

export default AddButton;
