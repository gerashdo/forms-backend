import { UploadedFile } from "express-fileupload";
import cloudinary from '../config/cloudinary';


export const uploadFile = (file: UploadedFile, validExtensions: string[]): Promise<string> => {
  return new Promise( (resolve, reject) => {
    const splitedName = file.name.split('.');
    const extension = splitedName[ splitedName.length - 1 ];

    if ( !validExtensions.includes(extension.toLocaleLowerCase())) {
      return reject('The file extension is not allowed');
    }

    cloudinary.uploader.upload(file.tempFilePath)
    .then( result => {
      resolve( result.secure_url );
    })
    .catch( err => {
      console.error(err);
      reject( err );
    });
  });
}

export const deleteFile = (fileUrl: string): Promise<boolean> => {
  return new Promise( (resolve, reject) => {
      const nameArr = fileUrl.split('/');
      const name = nameArr[ nameArr.length - 1 ];
      const [ public_id ] = name.split('.');
      cloudinary.uploader.destroy(public_id, (err) => {
        if (err) {
          console.error(err);
          reject(false);
        } else {
          resolve(true);
        }
      });
  });
}
