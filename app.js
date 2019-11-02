const express = require('express')
const pokemonRouter = require('./pokemons/router')  
const pokemonRouter2 = require('./pokemons/router_v2') 
const userRouter = require('./user/router')

const app =express()

app.use(express.json()) 
app.use(pokemonRouter) 
app.use('/v2',pokemonRouter2) 
app.use(userRouter)

module.exports = app