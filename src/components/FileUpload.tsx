import React, { ReactEventHandler } from 'react'
import axios from 'axios';
 
interface FileUploadProps {
    id: string,
}

// doesnt do anything, simply a placeholder
interface FileUploadState {
    files: FileList,
    fileName: string,
}

export class FileUpload extends React.Component<FileUploadProps, FileUploadState>  {

    constructor(props:FileUploadProps) {
        super(props);
        /*
        this.state = {
            files: [],
        }
        */
    }

    saveFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        const files = target.files;

        if(!files) {
            return false;
        }
        
        if (files) {
            this.setState(
                (state, props) => ({
                    files: files,
                }),
                () => {
                    console.log(files);
                }
            );
            console.log("SUCCESS: FILE SAVED");
        } else {
            console.log("ERROR: FILE NOT SAVED");
        }
    };

    
    uploadFiles = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const formData = new FormData();
        if (this.state.files) {
            console.log('1st file name:' + this.state.files[0].name)
        } else {
            console.log('file not found for upload');
        }
        for(let i = 0; i < this.state.files.length; ++i) {
            formData.append(this.state.files[i].name, this.state.files[i]);
        }
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
                <input id={this.props.id} type="file" multiple onChange={this.saveFile} />
                <button onClick={this.uploadFiles} > upload </button>
            </>
        );
    }
    
}
 
export default FileUpload;
