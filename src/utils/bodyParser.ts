import { NextFunction, Request, Response} from "express";
import { File, IncomingForm } from "formidable";
import FileData from "../upload/File";
import { BodyParserParam, ObjAny } from "./interface";
import { toObject } from "./json";

/**
 * Middleware function for Express that parses incoming request bodies and adds them to the `req.body` property.
 * @param {{saveFileAt: string}} options - An object containing options for the middleware. The `saveFileAt` property specifies where uploaded files should be saved.
 * @returns {(req: Request, _: Response, next: NextFunction) => void} A middleware function that can be used in an Express app.
 *
 * @example
 * import express from 'express';
 * import { BodyParser } from './BodyParser';
 *
 * const app = express();
 *
 * app.use(BodyParser({ saveFileAt: './uploads' }));
 *
 * app.post('/upload', (req, res) => {
 *   console.log(req.body);
 *   res.send('Upload successful!');
 * });
 */

export function BodyParser({saveFileAt}: BodyParserParam): (req: Request, _: Response, next: NextFunction) => void{

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

                req.body = {...fields}
                req.files = {...filesObj}

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