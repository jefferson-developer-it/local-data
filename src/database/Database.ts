import { ExistFolder } from "../upload/Read";
import { newFolder } from "../upload/SaveAt";
import { BaseDataCol, Collection, DataBase } from "../utils/interface";
import CollectionDb from "./Collection";

/**
 * Class representing a database.
 * @implements {DataBase}
 */
export default class Database implements DataBase{
    name: string = `default`;
    path: string = `${__dirname}/database`;
    cols: { [name: string]: Collection; } = {};

    /**
     * Creates a new instance of the database.
     *
     * @param {string} name - The name of the database.
     * @param {string} [path] - The optional path to the database. If not provided, it will use the default value set in the `path` property.
     */
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

    /**
     * Creates a new collection in the database.
     *
     * @template typeData
     * @param {string} name - The name of the collection to be created.
     *
     * @returns {CollectionDb<typeData>} The new collection created.
     * @example
     * const db = new Database('myDatabase');
     * const usersCollection = db.createCollection('users');
    */
    createCollection<typeData extends BaseDataCol=any>(name: string): CollectionDb<typeData>{
        const collection = new CollectionDb<typeData>(name, `${this.path}/${this.name}`);

        this.cols[name] = collection;

        return collection
    }
}