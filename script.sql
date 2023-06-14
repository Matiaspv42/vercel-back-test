CREATE DATABASE marketplace;
\c marketplace;


CREATE TABLE users ( id SERIAL PRIMARY KEY, email VARCHAR(50) NOT NULL UNIQUE, password VARCHAR(60) NOT NULL, picture VARCHAR(500) NOT NULL );
CREATE TABLE posts ( id SERIAL PRIMARY KEY, title VARCHAR(50) NOT NULL, description VARCHAR(2000) NOT NULL, img VARCHAR(500) NOT NULL, price INT NOT NULL, user_id INT REFERENCES users(id));
CREATE TABLE favorites ( user_id INT REFERENCES users(id), post_id INT REFERENCES posts(id) );

SELECT * FROM users;
SELECT * FROM posts;
SELECT * FROM favorites;

