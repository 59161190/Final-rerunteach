const express = require('express')
const MongoClient = require('mongodb').MongoClient
const router = express.Router()
const Mongourl ='mongodb+srv://superadmin:mart0877@cluster0-xauad.gcp.mongodb.net/test?retryWrites=true&w=majority'

router.post('/pokemons',async (req,res)=>{
    let poke = req.body
    let client =await MongoClient.connect(Mongourl ,
        {useNewUrlParser:true,useUnifiedTopology:true})
        .catch((err)=>{ 
            console.error(err)
            res.status(500).json({error:err})
        })
       let db = client.db('pokemondb')
       try {
            let result = await db.collection('pokemons').insertOne(poke)
            console.log(result)
            res.status(201).json({result:result})
       }catch{
           console.error(err)
           res.status(500).json({error:err})
       }finally{
           client.close()
       }
})

router.get('/pokemons',async (req,res)=>{
    let name = req.body.name
    let client =await MongoClient.connect(Mongourl ,
        {useNewUrlParser:true,useUnifiedTopology:true})
        .catch((err)=>{ 
            console.error(err)
            res.status(500).json({error:err})
        })
       let db = client.db('pokemondb')
       try {
           let docs = await db.collection('pokemons').find({}).toArray()
           res.json(docs)
       }catch{
           console.error(err)
           res.status(500).json({error:err})
       }finally{
           client.close()
       }
      
    
})

router.get('/pokemon/:id', (req,res)=>{
    let id = req.params.id
    res.json({pokemon_id:id})
} )


module.exports = router