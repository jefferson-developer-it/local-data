import { ExistFolder } from "../upload/Read";
import { newFolder } from "../upload/SaveAt";
import { Collection, DataBase } from "../utils/interface";
import CollectionDb from "./Collection";

export default class Database implements DataBase{
    name: string = `default`;
    path: string = `${__dirname}/database`;
    cols: { [name: string]: Collection; } = {};

    constructor(name: string, path?: string){
        this.name = name;
        this.path = path ?? this.path;
        

        ExistFolder(this.path, (err, local)=>{            
            if(err){
                newFolder(local)
            }

            ExistFolder(`${this.path}/${this.name}`, (err, path_file)=>{
                if(err){
                    newFolder(path_file)
                    return
                }
            })
        })
    }

    createCollection(name: string){
        const collection = new CollectionDb(name, `${this.path}/${this.name}`);

        this.cols[name] = collection;

        return collection
    }
}