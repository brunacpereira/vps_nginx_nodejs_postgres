/*================================================================
Server side Routing
Updated for pg@8 (no pg.connect)
=================================================================*/

const { Pool } = require('pg');
const database = require('../config/database.js');

const pool = new Pool({
    connectionString: database.conString
});

module.exports = {

    /*================================================================
    CREATE - POST
    =================================================================*/
    async createTodo(req, res) {
        const data = {
            text: req.body.text,
            done: false
        };

        try {
            await pool.query(
                "INSERT INTO todos(text, done) VALUES($1, $2)",
                [data.text, data.done]
            );

            const result = await pool.query(
                "SELECT * FROM todos ORDER BY id ASC"
            );

            return res.json(result.rows);

        } catch (err) {
            console.error("Erro ao criar TODO:", err);
            return res.status(500).send("Erro ao criar TODO");
        }
    },

    /*================================================================
    READ - GET
    =================================================================*/
    async getTodos(req, res) {
        try {
            const result = await pool.query(
                "SELECT * FROM todos ORDER BY id ASC"
            );

            return res.json(result.rows);

        } catch (err) {
            console.error("Erro ao buscar TODOS:", err);
            return res.status(500).send("Erro ao buscar TODOS");
        }
    },

    /*================================================================
    UPDATE - PUT
    =================================================================*/
    async updateTodo(req, res) {
        const id = req.params.todo_id;

        const data = {
            text: req.body.text,
            done: req.body.done
        };

        try {
            await pool.query(
                "UPDATE todos SET text=$1, done=$2 WHERE id=$3",
                [data.text, data.done, id]
            );

            const result = await pool.query(
                "SELECT * FROM todos ORDER BY id ASC"
            );

            return res.json(result.rows);

        } catch (err) {
            console.error("Erro ao atualizar TODO:", err);
            return res.status(500).send("Erro ao atualizar TODO");
        }
    },

    /*================================================================
    DELETE - DELETE
    =================================================================*/
    async deleteTodo(req, res) {
        const id = req.params.todo_id;

        try {
            await pool.query(
                "DELETE FROM todos WHERE id=$1",
                [id]
            );

            const result = await pool.query(
                "SELECT * FROM todos ORDER BY id ASC"
            );

            return res.json(result.rows);

        } catch (err) {
            console.error("Erro ao deletar TODO:", err);
            return res.status(500).send("Erro ao deletar TODO");
        }
    }

};

// /*================================================================
// Server side Routing
// Route Definitions

// Depending on the REST route/endpoint the PostgreSQL database 
// is Queried appropriately.

// PostgreSQL DB table name is: 'todos'
// =================================================================*/

// var pg = require('pg');

// var database = require('../config/database.js');
// var conString = database.conString;
// var results = [];


// module.exports = {

// 	/*================================================================
// 	CREATE - $http post
// 	=================================================================*/
// 	//create todo and send back all todos after creation
// 	createTodo : function(req, res) {

// 		results = [];

// 		//Data to be saved to the DB - taken from $http request packet
// 		var data = {
// 			text : req.body.text,
// 			done : false
// 		};

//   		// get a pg client from the connection pool
//   		pg.connect(conString, function(err, client, done) {
//    			client.query("INSERT INTO todos(text, done) values($1, $2)", [data.text, data.done]);

// 			var query = client.query("SELECT * FROM todos ORDER BY id ASC");

// 			//can stream row results back 1 at a time
// 			query.on('row', function(row) {
// 		      	results.push(row);
// 			});

// 			//fired after last row is emitted
// 			query.on('end', function() { 
// 				client.end();
// 				return res.json(results); // return all todos in JSON format  		
// 			});

// 			if(err)
// 				console.log(err);
//    		});
//     },


// 	/*================================================================
// 	READ - $http get
// 	=================================================================*/
// 	//Get all todos in the database
// 	getTodos : function(req, res) {

// 		results = [];

// 		// get a pg client from the connection pool
//   		pg.connect(conString, function(err, client, done) {
   
// 			var query = client.query("SELECT * FROM todos ORDER BY id ASC");

// 			//can stream row results back 1 at a time
// 			query.on('row', function(row) {
// 		      	results.push(row);
// 			});

// 			//fired after last row is emitted
// 			query.on('end', function() { 
// 			  client.end();
// 			  return res.json(results); // return all todos in JSON format
// 			});

// 			//console.log()
// 			if(err)
// 				console.log(err);

//    		});
// 	},


// 	/*================================================================
// 	UPDATE - $http put
// 	=================================================================*/
// 	updateTodo : function(req, res) {

// 		results = [];

//   		var id = req.params.todo_id;

// 		var data = {
// 			text : req.body.text,
// 			done: req.body.done
// 		};

// 		console.log("ID= "+id); //TEST

// 		// get a pg client from the connection pool
//   		pg.connect(conString, function(err, client, done) {

//    			client.query("UPDATE todos SET text=($1), done=($2) WHERE id=($3)", [data.text, data.done, id]);
// 			var query = client.query("SELECT * FROM todos ORDER BY id ASC");

// 			//can stream row results back 1 at a time
// 			query.on('row', function(row) {
// 		      	results.push(row);
// 			});

// 			//fired after last row is emitted
// 			query.on('end', function() { 
// 			  client.end();
// 			  return res.json(results); // return all todos in JSON format
// 			});

// 			//console.log()
// 			if(err)
// 				console.log(err);
//    		});	        
//     },

// 	/*================================================================
// 	DELETE - $http delete
// 	=================================================================*/
// 	deleteTodo : function(req, res) {

// 		results = [];
// 		var id = req.params.todo_id;

// 		console.log("id= "+id); //TEST

// 		// get a pg client from the connection pool
//   		pg.connect(conString, function(err, client, done) {

//    			client.query("DELETE FROM todos WHERE id=($1)", [id]);
   
// 			var query = client.query("SELECT * FROM todos ORDER by id ASC");

// 			//can stream row results back 1 at a time
// 			query.on('row', function(row) {
// 		      	results.push(row);
// 			});

// 			//fired after last row is emitted
// 			query.on('end', function() { 
// 			  client.end();
// 			  return res.json(results); // return all todos in JSON format
// 			});

// 			//console.log()
// 			if(err)
// 				console.log(err);
//    		});	 
// 	}
// };
