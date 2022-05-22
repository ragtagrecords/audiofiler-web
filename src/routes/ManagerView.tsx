import React from 'react';
import AddSongsForm from '../components/AddSongsForm';
import styles from '../globalstyle.module.css';

const ManagerView = () => {

    const defaultSong =  {
        fileName: "/defaultFileName.mp3",
        name: "defaultName",
        tempo: '0',
    };

    return (
        <>
            <h1 className={styles.title}>Manager</h1>
            <AddSongsForm songs={[defaultSong]}/>
        </>
    );
}

export default ManagerView;