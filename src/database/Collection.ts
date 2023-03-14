import { readFileSync } from "fs";
import { ExistFolder } from "../upload/Read";
import { saveFile } from "../upload/SaveAt";
import { BaseDataCol, Collection, ColProjection, ObjAny, OptionsFind, Projection, QueryDatabase } from "../utils/interface";
import { toObject } from "../utils/json";
import { v4 as uuidv4 } from 'uuid';

export default class CollectionDb <typeData extends BaseDataCol = any> implements Collection{
    name: string = "";
    path: string = "";
    pathBase: string = ""
    data: typeData[] = []

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

    deleteOne(query: {[query: string]: any}): boolean{
        const index = this.data.findIndex(item => this.validateQuery(item as ObjAny, query, true));
      
        if (index !== -1) {
          this.data.splice(index, 1);

          saveFile(this.pathBase, `col-${this.name}.json`, JSON.stringify({
            info: {name: this.name, path: this.path},
            data: this.data
          }, null, 3), "utf8");
          this.refresh();
          return true;
        }
      
        return false;
    }

    insertOne(data: typeData){
        this.data.push({
            ...data,
            _id: uuidv4()
        });
        
        saveFile(this.pathBase, `col-${this.name}.json`, JSON.stringify({
            info: {name: this.name, path: this.path},
            data: this.data
        }, null, 3), "utf8")
        

        this.refresh()
    }

    insertMany(data: typeData[]) {
        const newData = data.map(item => ({...item, _id: uuidv4()}));
        this.data.push(...newData);
      
        saveFile(this.pathBase, `col-${this.name}.json`, JSON.stringify({
          info: {name: this.name, path: this.path},
          data: this.data
        }, null, 3), "utf8");
      
        this.refresh();
    }

    findOne(query: {[query: string]: any}, options?: OptionsFind<typeData>){
        let data = this.data.find(item => this.validateQuery(item as ObjAny, query));

        if(options?.projection && data) data = this.Projection(data, options.projection)

        if(data) {
            data.save = this.updateOne.bind(this, { _id: data._id }, data);
            data.delete = this.deleteOne.bind(this, { _id: data._id });
        }

        return data ?? undefined
    }
   
    find(query?: {[query: string]: any}, options?: OptionsFind<typeData>){
        let data = [] as typeData[];

        if (query) {
            data = this.data.filter((item) => this.validateQuery(item as ObjAny, query)) as typeData[];
        }
      
        if(options?.skip){
            data = data.slice(Number(options.skip)) as typeData[];
        }

        if(options?.limit){
            data = data.slice(0, Number(options.limit)) as typeData[];
        }

        if(options?.projection){
            for(const i in data){
                data[i] = this.Projection(data[i], options.projection) as unknown as typeData;
                data[i].save = this.updateOne.bind(data, { _id: data[i]._id }, data);
            }
        }

        return data ?? undefined
    }

    updateOne(query: {[query: string]: any}, update: {[update: string]: any}) {       
        const index = this.data.findIndex(item => this.validateQuery(item as ObjAny, query, true));
        
        if (index < 0) return false;
    
        this.data[index] = {...this.data[index], ...update};

        saveFile(this.pathBase, `col-${this.name}.json`, JSON.stringify({
            info: {name: this.name, path: this.path},
            data: this.data
          }, null, 3), "utf8");
          this.refresh();
          
        return true;
    }

    private validateQuery(item: ObjAny, query: QueryDatabase, keySame: boolean = false): boolean {
        
        for (const key in query) {
          const itemValue = item[key]
          const queryValue = query[key]

          if(!item.hasOwnProperty(key)) return false;
          
          else if(keySame && itemValue !== queryValue){            
            return false;
          }

          else if (typeof queryValue === "string") {
            if (
                !itemValue.toString().toLowerCase().includes(queryValue.toString().toLowerCase()) && 
                !itemValue.toString().includes(queryValue.toString()) && 
                itemValue.toString() !== queryValue.toString() &&
                itemValue.toString().toLowerCase() !== queryValue.toString().toLowerCase()
            ) {
              return false;
            }
              
          } else if(Array.isArray(itemValue) && !itemValue.includes(queryValue)) {
            return false
          } else if(itemValue !== queryValue) {
            return false;
          }
        }
        return true;
    }

    private Projection(data: typeData, projection: ColProjection<typeData>){
        const keysOfData = Object.keys(data as ObjAny);
        const dataCopy = data as ObjAny
        const objectReturn = {} as ObjAny

        for(const key of keysOfData){
            if(projection[key as keyof typeof projection] && typeof projection[key as keyof typeof projection] === "boolean"){
                objectReturn[key] = dataCopy[key]
            }
            else if(typeof projection[key as keyof typeof projection] === "object" && projection[key as keyof typeof projection]) {
                const proj = projection[key as keyof typeof projection] as Projection;
                if(typeof dataCopy[key] === "object" && Array.isArray(dataCopy[key])){
                    objectReturn[key] = proj.includes? (proj.includes && dataCopy[key].indexOf(proj.includes) != -1? dataCopy[key]: null): dataCopy[key]
                    objectReturn[key] = proj.join? objectReturn[key].join(proj.join): objectReturn[key];
                    objectReturn[key] = proj.maxLength? objectReturn[key].slice(0, proj.maxLength): objectReturn[key];
                }else if(typeof dataCopy[key] === "string"){
                    objectReturn[key] = proj.includes? (proj.includes && dataCopy[key].includes(proj.includes)? dataCopy[key]: null): dataCopy[key]
                    objectReturn[key] = proj.split? objectReturn[key].split(proj.split): objectReturn[key];
                    objectReturn[key] = proj.maxLength? objectReturn[key].substr(0, proj.maxLength): objectReturn[key];
                }
            }
        }

        return objectReturn as typeData
    }
}