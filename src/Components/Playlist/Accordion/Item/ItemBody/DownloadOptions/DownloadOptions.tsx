import React from 'react';
import { Song } from 'Types';
import { downloadFile, removeExtraExtensions } from 'Services/FileSvc';
import './DownloadOptions.scss';

type DownloadableFile = {
  url: string;
  fileName: string;
}

type DownloadOptionsProps = {
  song: Song;
}

const DownloadOptions = ({ song }: DownloadOptionsProps) => {
  const handleClick = (file: DownloadableFile) => {
    // Attempts to make the file name and extension appropriate
    // I hate this - we should just store the zip file and file name explicitly in DB
    downloadFile(file.url, file.fileName);
  };

  if (song && song.path) {
    const files: DownloadableFile[] = [];
    const songFileExt = `${song.path.split('.').pop()}` ?? 'mp3';
    files.push({
      url: song.path,
      fileName: `${removeExtraExtensions(song.name)}.${songFileExt}`,
    });
    if (song.zipPath) {
      files.push({
        url: song.zipPath,
        fileName: `${removeExtraExtensions(song.name)}.zip`,
      });
    }
    return (
      <>
        <ul className="downloadOptions">
          {files.map((file: DownloadableFile) => {
            return (
              <li key={file.url}>
                <button type="button" onClick={handleClick.bind(null, file)}>
                  {file.fileName}
                </button>
              </li>
            );
          })}
        </ul>
      </>
    );
  }
  return (
    <div>No files found :(</div>
  );
};

export default DownloadOptions;
