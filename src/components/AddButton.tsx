import React from 'react';
import './AddButton.css';
import plusButton from '../assets/blue-plus.png';

type AddButtonProps = {
    href: string
}

const AddButton = (props: AddButtonProps) => {
    return (
        <a href={props.href}>
            <img src={plusButton} />
        </a>
    )
}

export default AddButton;
