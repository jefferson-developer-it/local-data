import { ObjAny } from "./interface";

export function toObject(json: string){
    try {
        return JSON.parse(json)
    } catch (error) {
        try {
            return parseQuery(json)
        } catch (error) {
            return {}
        }
    } 
}

export function parseQuery(query: string){
    const result = {} as ObjAny

    for(const data of query.replace("?", "").split("&")){
        const [name, val] = data.split("=");

        result[name] = val
    }

    return result
}