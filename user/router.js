const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const MongoClient = require('mongodb').MongoClient
const router = express.Router()
const jwtkey = process.env.JWT_KEY
const Mongourl ='mongodb+srv://superadmin:mart0877@cluster0-xauad.gcp.mongodb.net/test?retryWrites=true&w=majority'

router.post('/register' ,async (req,res)=>{
    let email = req.body.email
    let password  = req.body.password
    let encryptedPwd = await bcrypt.hash(password, 8 ).catch((err)=>{
        console.error(err)
        res.status(500).json({error:err})
        return
    })

    let client = await MongoClient.connect(
        Mongourl,{useNewUrlParser:true,useUnifiedTopology:true}
    ).catch((err)=>{
        console.error(err)
        res.status(500).json({erroe:err})
        return
    })

    try{
        let db = client.db('buu')
        let result = await db.collection('users').insertOne(
            {email:email,password:encryptedPwd}
        )
        res.status(201).json({result:result})

    }catch{
        console.error(err)
        res.status(500).json({erroe:err})
        return
    }finally{
        client.close()
    }
})

router.post('/sign-in',async (req,res)=>{
    let email = req.body.email
    let password  = req.body.password

    let client = await MongoClient.connect(
        Mongourl,{useNewUrlParser:true,useUnifiedTopology:true}
    ).catch((err)=>{
        console.error(err)
        res.status(500).json({erroe:err})
        return
    })

    try {
        let db = client .db('buu')
        let user = await db.collection('users').findOne({email:email})

        if(!user){
            res.status(400).json({error: `Email: ${email} is not existed`})
            return
        }

        let valid = await bcrypt.compare(password,user.password)
        if(!valid){
            res.status(401).json({error: `You email or password is incorrect`})
            return
        }

        let jwtKey = 'supersecure'
        let token = await jwt.sign(
            {email: user.email, _id:user._id}, //payload
            jwtKey,{expiresIn : 120}
        )
        res.json({token:token})
    }catch{
        console.error(err)
        res.status(500).json({erroe:err})
        return
    }finally{
        client.close()
    }
})

const auth = async (req,res,next)=>{
    let token = req.header('Authorization')
    let decoded
    try{
        decoded = await jwt.verify(token, jwtkey)
        req.decoded = decoded
        next()
    }catch(err){
        console.error(`Invalid token ${err}`)
        res.status(401).json({error:err})
        return
    }
}
router.get('/me' , auth , async (req,res)=>{
    let client = await MongoClient.connect(
        Mongourl,{useNewUrlParser:true,useUnifiedTopology:true}
    ).catch((err)=>{
        console.error(err)
        res.status(500).json({erroe:err})
        return
    })

    try{
        let db = client.db('buu')
        let result = await db.collection('users').findOne({email:email})
        delete user.password
        res.status(200).json({result:result})

    }catch{
        console.error(err)
        res.status(500).json({erroe:err})
        return
    }finally{
        client.close()
    }
})

module.exports = router