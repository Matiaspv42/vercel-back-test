const express = require("express")
const jwt = require("jsonwebtoken")

const { secretKey } = require("./secretkey")
const cors = require("cors")
const app = express()

const { registrarUsuario, verificarCredenciales, obtenerDatosDeUsuario, actualizadUsuario, registrarPost, obtenerPosts, registrarFavorito, obtenerFavoritos } = require("./consultas")
const { checkCredentialsExists, tokenVerification } = require("./middlewares")

app.listen(3000, console.log("SERVER ON"))
app.use(cors())
app.use(express.json())

app.post("/users", checkCredentialsExists, async (req, res) => {
    try {
        const usuario = req.body
        await registrarUsuario(usuario)
        res.status(201).send("Usuario creado con éxito")
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        await verificarCredenciales(email, password)
        const token = jwt.sign({ email }, secretKey)
        const user = await obtenerDatosDeUsuario(email)
        res.send({ token, user })
    } catch ({ code, message }) {
        res.status(code).send(message)
    }

})

app.put("/users/:id", tokenVerification, checkCredentialsExists, async (req, res) => {
    try {
        const { id } = req.params
        const usuario = req.body
        await actualizadUsuario(usuario, id)
        res.status(201).send("Datos de Usuario actualizados con éxito")
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post("/posts", tokenVerification, async (req, res) => {
    try {
        const post = req.body
        await registrarPost(post)
        res.status(201).send("Post creado con éxito")
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

app.get("/posts", tokenVerification, async (req, res) => {
    try {
        const post = req.body
        const posts = await obtenerPosts(post)
        res.status(200).send(posts)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

app.post("/favorites", tokenVerification, async (req, res) => {
    try {
        const favorito = req.body
        await registrarFavorito(favorito)
        res.status(201).send("Favorito agregado con éxito")
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

app.get("/favorites/:user_id", tokenVerification, async (req, res) => {
    try {
        const { user_id } = req.params
        const favorito = req.body
        const favoritos = await obtenerFavoritos(user_id)
        res.status(200).send(favoritos)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})


