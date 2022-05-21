import React from 'react';
import AddSongsForm from '../components/AddSongsForm';

const ManagerView = () => {

    const defaultSong =  {
        fileName: "/defaultFileName.mp3",
        name: "defaultName",
        tempo: '0',
    };

    return (
        <>
            <h1>manager page</h1>
            <AddSongsForm songs={[defaultSong]}/>
        </>
    );
}

export default ManagerView;