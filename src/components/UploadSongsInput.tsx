import React, { useEffect, useState, ChangeEventHandler } from 'react'
 
type UploadSongsInputProps = {
    handleChange: ChangeEventHandler<HTMLInputElement>;
}

const UploadSongsInput = (props:UploadSongsInputProps) => {
    return (
        <>
            <label> 
                Choose songs to upload 
                <input 
                    id="uploadedSongs" 
                    name="uploadedSongs"
                    type="file" 
                    multiple 
                    onChange={props.handleChange} 
                />
            </label>
        </>
    );
    
}
 
export default UploadSongsInput;
