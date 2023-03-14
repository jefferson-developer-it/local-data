import { readFileSync } from "fs";
import { ExistFolder } from "../upload/Read";
import { newFolder, saveFile } from "../upload/SaveAt";
import { Collection, ObjAny } from "../utils/interface";
import { toObject } from "../utils/json";

export default class CollectionDb  implements Collection{
    name: string = "";
    path: string = "";
    pathBase: string = ""
    data: any[] = []

    constructor(name: string, databasePath: string){
        this.name = name;
        this.path = `${databasePath}/col-${name}.json`
        this.pathBase = databasePath

        ExistFolder(this.path, (err, folder)=>{
            if(err){
                saveFile(databasePath, `col-${this.name}.json`, JSON.stringify({
                    info: {name: this.name, path: this.path},
                    data: this.data ?? []
                }, null, 3), "utf8")
                return
            }

            this.refresh()      
        })
    }

    refresh(){
        const data = toObject(readFileSync(this.path, "utf8"));
        this.data = data.data  
    }


    insertOne(data: ObjAny){
        this.data.push(data);
        
        saveFile(this.pathBase, `col-${this.name}.json`, JSON.stringify({
            info: {name: this.name, path: this.path},
            data: this.data
        }, null, 3), "utf8")
        

        this.refresh()
    }

    findOne(query: {[query: string]: any}){
        let data = null;

        for (const key in query) {
            if (query.hasOwnProperty(key)) {
              data = this.data.find(item => item[key] === query[key]);
              if (data) break;
            }
        }

        return data ?? undefined
    }
}