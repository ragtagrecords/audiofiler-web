import axios from 'axios';

export const downloadFile = (fileUrl: string, fileName: string) => {
  axios({
    url: fileUrl,
    method: 'GET',
    responseType: 'blob', // important
  }).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
  });
};

export const getExtension = (fileName: string): string => {
  return fileName.split('.').pop() ?? 'undefined';
};

export const removeExtraExtensions = (fileName: string): string => {
  const splitFileName = fileName.split('.');
  return splitFileName[0] ?? 'New Name Here';
};
