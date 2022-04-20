import React, { ReactEventHandler } from 'react'
import axios from 'axios';
 
interface FileUploadProps {
    id: string,
}

// doesnt do anything, simply a placeholder
interface FileUploadState {
    file: File | string,
    fileName: string,
}

export class FileUpload extends React.Component<FileUploadProps, FileUploadState>  {

    constructor(props:FileUploadProps) {
        super(props);
        this.state = {
            file: '',
            fileName: ''
        }
    }

    saveFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        const file = target.files ? target.files[0] : null;

        if(!file) {
            return false;
        }
        const actualFileName = file.name;

        // if file exists and we have a name for it
        if (file && (this.state.fileName || actualFileName)) {
            this.setState(
                (state, props) => ({
                    file: file,
                    fileName: state.fileName ? state.fileName : actualFileName // prefer users fileName
                }),
            );
            console.log("SUCCESS: FILE SAVED");
        } else {
            console.log("ERROR: FILE NOT SAVED");
        }
        
    };

    uploadFile = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const formData = new FormData();
        if (this.state.file) {
            console.log('file name:' + this.state.fileName)
        } else {
            console.log('file not found for upload');
        }
        formData.append("file", this.state.file);
        formData.append("fileName", this.state.fileName);
        try {
            const res = await axios.post(
                "http://api.ragtagrecords.com/public/songs",
                formData
            );
            console.log(res);
        } catch (ex) {
            console.log(ex);
        }
    };

    handleNameChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ fileName: event.target.value });
        
    };
 

    render() {
        return (
            <>
                <label> 
                    Song name 
                    <input id='songName' name='songName' type='text' onChange={this.handleNameChange}/>
                </label>
                <input id={this.props.id} type="file" onChange={this.saveFile} />
                <button onClick={this.uploadFile}>Upload</button>
            </>
        );
    }
    
}
 
export default FileUpload;
