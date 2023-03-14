import { NextFunction, Request, Response} from "express";
import { File, IncomingForm } from "formidable";
import FileData from "../upload/File";
import { BodyParserParam, ObjAny } from "./interface";
import { toObject } from "./json";

export function BodyParser({saveFileAt}: BodyParserParam){

    return async(req: Request, _: Response, next: NextFunction)=>{       
       if(req.headers["content-type"]?.includes("multipart/form-data")){
            const form = new IncomingForm()

            form.parse(req, (err, fields, files)=>{
                if(err) {
                    next(err)
                    return err
                }

                const filesObj = {} as ObjAny<FileData>;

                for(const fileName of Object.keys(files)){
                    filesObj[fileName] = new FileData({...files[fileName] as File, saveAt: saveFileAt || `${__dirname}/upload`})
                }

                req.body = {...fields, ...filesObj}

                next()                
            })
        }else{
            const buffer = [];

            for await(const chunk of req){
                buffer.push(chunk)
            }

            const bodyBase = toObject(Buffer.concat(buffer).toString())
            
            req.body = bodyBase ?? {};


            next()
        }
    }
}