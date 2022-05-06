import React from 'react';
import { FileUpload } from '../components/FileUpload';


export default class ManagerView extends React.Component{

  render() {
    return (
      <>
        <h1>manager page</h1>
        <FileUpload id='main' />
      </>
    );
  }
}