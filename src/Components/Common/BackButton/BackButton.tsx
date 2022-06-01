import React from 'react';
import './BackButton.scss';
import backButton from 'Assets/blue-back-arrow.png';
import { Link } from 'react-router-dom';

type BackButtonProps = {
    href?: string;
}

const BackButton = (props: BackButtonProps) => {
  if (props.href) {
    return (
      <a href={props.href}>
        <img alt="backButton" className="backButton" src={backButton} />
      </a>
    );
  }
  return (
    <Link to="/">
      <img alt="backButton" className="backButton" src={backButton} />
    </Link>
  );
};

BackButton.defaultProps = {
  href: '',
};

export default BackButton;
