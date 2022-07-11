import axios from 'axios';

const fileServerURL = 'https://files.ragtagrecords.com';

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

export const uploadFile = async (file: File, dir: string) => {
  if (!file || !dir) {
    return false;
  }
  const url = `${fileServerURL}${dir}`;
  const formData = new FormData();
  formData.append('file', file);
  try {
    await axios.post(
      url,
      formData,
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const getExtension = (fileName: string): string => {
  return fileName.split('.').pop() ?? 'undefined';
};

export const removeExtraExtensions = (fileName: string): string => {
  const splitFileName = fileName.split('.');
  return splitFileName[0] ?? 'New Name Here';
};
