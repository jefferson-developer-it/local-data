import express from "express";
import path from "path"
import sls from "../index"

const database = new sls.Database("teste", `${__dirname}/database`)

const TesteCol = database.createCollection("teste")

const app = express();

app.use(express.static(path.join("/public")))
app.use(sls.BodyParser({saveFileAt: "C:\\Users\\Jefferson\\Desktop\\uploadImage"}))

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

    foto.Upload()

    TesteCol.insertOne({
        nome,
        id,
        foto: foto.uploadFolder
    })

    res.send("Teste")
})

app.listen(2000, ()=>{
    console.log(`http://localhost:2000`);
})