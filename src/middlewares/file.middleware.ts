import {Request,Response, NextFunction} from "express"
import {UploadedFile} from "express-fileupload";
import {ApiError} from "../errors/api.error";
class FileMiddleware{
    public isFileValid(key: string, fileConfig:{size: number, mimetypes:string[]}){
     return  ( req: Request, res: Response, next: NextFunction)=>{
            try {
                const file = req.files?.[key] as UploadedFile
                if (!file) {
                    throw  new ApiError("file not found", 400)
                }
                if(Array.isArray(file)){
                    throw  new ApiError(`${key} should be single file`, 400)
                }
                if (file.size > fileConfig.size) {
                    throw new ApiError("File is too big", 400);
                }
                if (!fileConfig.mimetypes.includes(file.mimetype)) {
                    throw new ApiError("Invalid format", 400);
                }
                next();
            } catch (e){next(e)}
        }
    }
}
export const fileMiddleware = new FileMiddleware()