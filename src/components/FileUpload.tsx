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
        const fileName = file!.name ? file!.name : null

        if (file && fileName) {
            this.setState(
                (state, props) => ({
                    file: file,
                    fileName: fileName
                }),
            );
            console.log("FILE SAVED");
        } else {
            console.log("FILE NOT SAVED");
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
                "http://api.ragtagrecords.com/public/audio",
                formData
            );
            console.log(res);
        } catch (ex) {
            console.log(ex);
        }
    };
 

    render() {
        return (
            <>
                <input id={this.props.id} type="file" onChange={this.saveFile} />
                <button onClick={this.uploadFile}>Upload</button>
            </>
        );
    }
    
}
 
export default FileUpload;