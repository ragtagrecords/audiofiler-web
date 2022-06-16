import React, { useMemo } from 'react';
import './BackButton.scss';
import backButton from 'Assets/blue-back-arrow.png';
import { Link } from 'react-router-dom';
import { IconContext } from 'react-icons';
import { BiArrowBack } from 'react-icons/bi';

type BackButtonProps = {
    href?: string;
}

const BackButton = (props: BackButtonProps) => {
  const iconStyles = useMemo(() => ({
    color: '#5ae7ff', // this is tertiaryColor from Styles/vars.. couldnt figure out how to import it
    size: '50px',
    // position: fixed;
    // top: 20px;
    // left: 20px;
    // z-index: vars.$floatingZ + 10;

    // :hover {
    // color: vars.$white;
  }), []);

  if (props.href) {
    return (
      <a href={props.href}>
        <img alt="backButton" className="backButton" src={backButton} />

        {/* <IconContext.Provider value={iconStyles}>
          <label><BiArrowBack /></label>
        </IconContext.Provider> */}
      </a>
    );
  }
  return (
    <Link to="/">
      {/* <IconContext.Provider value={iconStyles}>
        <label><BiArrowBack /></label>
      </IconContext.Provider> */}

      <img alt="backButton" className="backButton" src={backButton} />
    </Link>
  );
};

BackButton.defaultProps = {
  href: '',
};

export default BackButton;
