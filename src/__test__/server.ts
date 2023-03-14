import express from "express";
import path from "path"
import sls from "../index"
import { BaseDataCol } from "../utils/interface";

interface dbTeste extends BaseDataCol {
    nome: string| string[]
    foto: string
    id: string
    lastRead?: number
}

const database = new sls.Database("teste", `${__dirname}/database`)

const TesteCol = database.createCollection<dbTeste>("teste")

const app = express();

app.use(express.static(path.join("/public")))
app.use(sls.BodyParser({saveFileAt: `${__dirname}/upload`}))

sls.setTempPath(`${__dirname}/tmp`)

app.get("/", (req, res)=>{
    res.sendFile(`${__dirname}/public/index.html`) 
})

app.post("/save", async(req, res)=>{
    const {id, foto, nome} = req.body;

    const exist = TesteCol.findOne({id});

    if(exist){
        return res.send(`O id ${id} já foi registrado.`)
    }

    const dirPhoto = foto.Upload()

    TesteCol.insertOne({
        nome,
        id,
        foto: dirPhoto
    })

    res.send("Teste")
})

app.post("/searchOne",async (req, res) => {
    const data = TesteCol.findOne({id: req.body.id})

    if(data) {        
        let html = sls.FileManager.ReadFile(`${__dirname}/public/oneData.html`, "utf8")

        const foto = sls.FileManager.ReadFile(data.foto);

        html = html.replace(/\$foto/g, `data:image/${path.extname(data.foto)||"*"};base64,${foto}`)
        html = html.replace(/\$nome/g, Array.isArray(data.nome)? data.nome?.join("."): data.nome)        
        html = html.replace(/\$id/g, data.id)   

        data.lastRead = Date.now()

        data.save && data.save()
        
        return res.send(html) 
    }

    res.send(`O item com id ${req.body.id} não existe.`)
})

app.post("/searchMany",async (req, res) => {
    const {limite, pular, nome} = req.body;
    console.log(nome && {nome}, nome);
        

    const lista = TesteCol.find(nome? {nome}: {}, {
        limit: limite,
        skip: pular,
    });

    res.json(lista)
})


app.post("/deleteOne", async (req, res) => {
    const data = TesteCol.findOne({id: req.body.id})

    if(data){
        const deleted = data.delete && data.delete()
        res.send(`O item com id ${req.body.id} ${deleted? "foi": "não foi"} deletado.`)
        return
    }

    res.send(`O item com id ${req.body.id} não existe.`)
})
app.listen(2000, ()=>{
    console.log(`http://localhost:2000`);
})