import React from 'react';
import Playlist from './../components/Playlist'


export default class Gallery extends React.Component {

  // TODO: pull these from API
  tracks = [
    {
      label: 'song1',
      url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3'
    },
    {
      label: 'song2',
      url: 'https://samplelib.com/lib/preview/mp3/sample-9s.mp3'
    },
  ];

  render() {
    return (
      <>
        <h1>gallery page</h1>
        <Playlist />
      </>
    );
  }
}
