import multer from 'multer'
import path from 'path'
import { v4 } from 'uuid';

const fileUploadMiddleware = (fieldName: string, dir: string = 'images') => {

    return multer({
        storage: multer.diskStorage({
            destination: 'public/' + dir,
            filename: (req, file, callback) => {
                const extension = path.extname(file.originalname);
                callback(null, v4() + extension);
            }
        }),
        limits: {
            fileSize: 1024 * 1024 * 3 //Tối đa 3MB
        },
        fileFilter: (req: Express.Request, file: Express.Multer.File, callback: Function) => {
            if (
                file.mimetype === 'image/png' ||  //định dạng ảnh được cho phép
                file.mimetype === 'image/jpg' ||  
                file.mimetype === 'image/jpeg'
            ) {
                callback(null, true);
            } else {
                callback(new Error('Only JPEG and PNG images are allowed.'), false);
            }
        }
    }).single(fieldName);
}

export default fileUploadMiddleware;
