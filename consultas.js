const bcrypt = require("bcryptjs");
const { Pool } = require("pg");
const env = require('dotenv')

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL + "?sslmode=require",
});

const registrarUsuario = async (usuario) => {
    let { email, password, picture } = usuario;
    const passwordEncriptada = bcrypt.hashSync(password);
    password = passwordEncriptada;
    const values = [email, passwordEncriptada, picture];
    const consulta = "INSERT INTO users values (DEFAULT, $1, $2, $3)";
    await pool.query(consulta, values);
};

const actualizadUsuario = async (usuario, id) => {
    let { email, password, picture } = usuario;
    const passwordEncriptada = bcrypt.hashSync(password);
    password = passwordEncriptada;
    const values = [email, password, picture, id];
    const consulta =
        "UPDATE users SET email = $1, password = $2, picture = $3 WHERE id = $4";
    await pool.query(consulta, values);
};

const obtenerDatosDeUsuario = async (email) => {
    const values = [email];
    const consulta = "SELECT * FROM users WHERE email = $1";

    const {
        rows: [usuario],
        rowCount,
    } = await pool.query(consulta, values);

    if (!rowCount) {
        throw {
            code: 404,
            message: "No se encontró ningún usuario con este email",
        };
    }

    delete usuario.password;
    return usuario;
};

const obtenerPosts = async () => {
    const consulta = "SELECT * FROM posts";
    const { rows: posts } = await pool.query(consulta);
    return posts;
};

const verificarCredenciales = async (email, password) => {
    const values = [email];
    const consulta = "SELECT * FROM users WHERE email = $1";

    const {
        rows: [usuario],
        rowCount,
    } = await pool.query(consulta, values);

    if (!rowCount)
        throw {
            code: 404,
            message: "No se encontró ningún usuario con estas credenciales",
        };

    const passwordEncriptada = usuario?.password;
    const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada);

    if (!passwordEsCorrecta)
        throw { code: 401, message: "Contraseña incorrecta" };
};

const registrarPost = async (post) => {
    const { title, description, img, price, user_id } = post;
    const values = [title, description, img, price, user_id];
    const consulta = "INSERT INTO posts values (DEFAULT, $1, $2, $3, $4, $5)";
    await pool.query(consulta, values);
};

const registrarFavorito = async (post) => {
    const { user_id, post_id } = post;
    const values = [user_id, post_id];
    const consulta = "INSERT INTO favorites values ($1, $2)";
    await pool.query(consulta, values);
};

const obtenerFavoritos = async (user_id) => {
    const consulta = `
    SELECT id, title, description, img, price from 
    (SELECT user_id FROM favorites WHERE user_id = $1) AS favorites 
    INNER JOIN posts on favorites.user_id = posts.id;`;
    const { rows: favorites } = await pool.query(consulta, [user_id]);
    return favorites;
};


module.exports = {
    registrarUsuario,
    verificarCredenciales,
    obtenerDatosDeUsuario,
    actualizadUsuario,
    registrarPost,
    obtenerPosts,
    registrarFavorito,
    obtenerFavoritos,
};
