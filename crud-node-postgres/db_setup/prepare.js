'use strict';

const { Pool } = require('pg');
const database = require('../server/config/database.js');

console.log('database:', database);

const pool = new Pool({
    connectionString: database.conString
});

async function setupDatabase() {
    try {
        console.log("Conectando ao banco de dados...");

        // Criar tabela se não existir
        await pool.query(`
            CREATE TABLE IF NOT EXISTS todos (
                id SERIAL PRIMARY KEY,
                text VARCHAR(255),
                done BOOLEAN
            )
        `);

        // Inserir dados iniciais
        await pool.query(
            "INSERT INTO todos(text, done) VALUES('Hi!', true) ON CONFLICT DO NOTHING"
        );

        await pool.query(
            "INSERT INTO todos(text, done) VALUES('Hello!', false) ON CONFLICT DO NOTHING"
        );

        // Buscar tudo
        const result = await pool.query("SELECT * FROM todos");

        result.rows.forEach(row => {
            console.log(row);
        });

        console.log("DB Done!");

    } catch (err) {
        console.error("Erro no banco de dados:", err);
    } finally {
        // Fecha as conexões do pool
        await pool.end();
    }
}

// Executa
setupDatabase();

// 'use strict';

// var pg = require('pg');
// var database = require('../server/config/database.js');
// console.log('database: ', database)
// var conString = database.conString;

// var client = new pg.Client(conString);
// client.connect();

// client.query("CREATE TABLE todos(id serial not null primary key, text name, done boolean)");
// client.query("INSERT INTO todos(text, done) values('Hi!',true)");
// client.query("INSERT INTO todos(text, done) values('Hello!', false)");

// var query = client.query("SELECT * FROM todos");

// query.on('row', function(row) {
//     console.log(row);
// });

// console.log('DB Done 2!');

// query.on('end', function() {
//     client.end();
// });
// 'use strict';

// var pg = require('pg');
// var database = require('../server/config/database.js');
// console.log('database: ', database)
// var conString = database.conString;

// var client = new pg.Client(conString);

// client.connect()
//   .then(() => {
//     console.log("Conectado ao banco de dados");

//     // Criar a tabela (caso não exista)
//     return client.query("CREATE TABLE IF NOT EXISTS todos(id serial PRIMARY KEY, text VARCHAR(255), done BOOLEAN)");
//   })
//   .then(() => {
//     // Inserir dados
//     return client.query("INSERT INTO todos(text, done) VALUES('Hi!', true) ON CONFLICT DO NOTHING");
//   })
//   .then(() => {
//     return client.query("INSERT INTO todos(text, done) VALUES('Hello!', false) ON CONFLICT DO NOTHING");
//   })
//   .then(() => {
//     // Realizar a consulta
//     return client.query("SELECT * FROM todos");
//   })
//   .then(result => {
//     // Exibir as linhas retornadas pela consulta
//     result.rows.forEach(row => {
//       console.log(row);
//     });

//     console.log('DB Done!');
//   })
//   .catch(err => {
//     console.error('Erro no banco de dados: ', err);
//   })
//   .finally(() => {
//     // Garantir que a conexão seja fechada
//     client.end();
//   });
