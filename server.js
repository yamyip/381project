const assert = require('assert');
const session = require('cookie-session');

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const mongourl = 'mongodb+srv://yamyip:Nn785412@cluster0.srzd1zr.mongodb.net/?retryWrites=true&w=majority'; 
const dbName = 'cluster0';

var documents = {};

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const SECRETKEY = 'cs381'

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    username: "session",  
    keys: [SECRETKEY]
}));

app.get('/', function(req, res){
	if(!req.session.authenticated){
		console.log("Not authenticated; directing to login");
        	res.status(200).redirect("/login");
	}else{
    		res.status(200).redirect("/login");
	}
    	console.log("Hello, welcome back");
});

//login 
app.get('/login', function(req,res){
	res.status(200).render('login');	
});

app.post('/login', async function(req, res){
	console.log("Waiting for login request");
	const client = new MongoClient(mongourl);
	try {
    		client.connect();
		var collection = client.db(dbName).collection('usersinfo').find();
		var rows = await collection.toArray();

    		for(var user of rows){
			var username = user.username;
			var password = user.password;
			if(username == req.body.username && password == req.body.password){
				req.session.authenticated = true;
				req.session.username = req.body.username;
				console.log(req.session.username);
				console.log('Login successed');
				return res.status(200).render("home");
			}
			else
				continue;

		}
		return res.status(200).redirect("/");
	} 
	finally {
    		client.close();
	}
    
});


//create
app.get('/create', function(req, res) {
    return res.status(200).render('create');
});

const createDocs = function(db, documents, callback){
	console.log('start creating');
        db.collection('ToDoList').insertOne(documents)
	console.log('insert successfully');
        return callback();
}

app.post('/create', function(req, res){
	console.log('...Welcome to create page');
	const client = new MongoClient(mongourl);
	try{
		client.connect()
        		
        	console.log("Connected successfully to the DB server.");
        	const db = client.db(dbName);
        	documents['username'] = req.session.username;
    		documents['id'] = req.body.id;
    		documents['venue']= req.body.venue;
    		documents['event']= req.body.event;
    		documents['detail']= req.body.detail;

        	if(documents.id){
            		console.log("...Creating the document");
            		createDocs(db, documents, function(docs){
                		res.status(200).render('info',{infoMsg:'Document created'});
            		});
        	} else{
            		res.status(200).render('info',{infoMsg:'Could not create, please try again later'});
        	}
	}
	finally{
		client.close();
		console.log("Closed DB connection");
		document = {};
	}		
});

//search
app.get('/search',function(req,res){
	res.status(200).render('search');
});

app.post('/search',function(req,res){
	Handle_search(req.body.ID,req,res)
});

searchDoc = async function(db,query,callback){
	console.log('start searching');
	var foundDoc = {};
	foundDoc = await db.collection('ToDoList').findOne(query);
	console.log(foundDoc);
	return callback(foundDoc);		
}	

Handle_search = function(eventID,req,res){	
	const client = new MongoClient(mongourl);
	console.log('...Welcome to search page');
	try{
		client.connect();
		console.log("Connected successfully to the DB server.");
		const db = client.db(dbName);
		const searchQuery = {id:eventID,	
				username:req.session.username};
		console.log(searchQuery);
		searchDoc(db,searchQuery,function(document){
			if(document == null){
				console.log('document not found');	
				client.close();
				console.log('connection closed');
				res.status(404).render('info',{infoMsg:'event not found'});
			}
			else{
				console.log('document found');	
				client.close();
				console.log('connection closed');
				res.render('display', {year:document.id.substring(0,4), month:document.id.substring(4,6) , day:document.id.substring(6,8) ,hour:document.id.substring(8,10), minute:document.id.substring(10,12), event:document.event, venue:document.venue,detail:document.detail});	
			}
		});
	}
	catch(error){
		console.log(error);
	}
}

//update

app.get('/update', function(req, res) {
  res.status(200).render('update');
});

app.post('/update', async function(req, res) {
  try {
    var item = {
      event: req.body.event,
      venue: req.body.venue,
      detail: req.body.detail
    };
    var id = req.body.id;

    const client = await MongoClient.connect(mongourl);
    const db = client.db(dbName);
    const result = await db.collection('ToDoList').updateOne({ "id":id }, { $set: item });
    
    console.log("Item updated");
    client.close();
    res.status(200).render('info', { infoMsg: 'Update completed' });
  } catch (err) {
    console.error(err);
    res.status(500).render('info', { infoMsg: 'An error occurred' });
  }
});	



//delete
app.get('/delete',function(req,res){
	res.status(200).render('delete');
});

app.post('/delete',function(req,res){
	Handle_delete(req.body.ID,res);
});

deleteDoc = async function(db,ID,callback){
	console.log('start deleting ');
	const deleteQuery = {id:ID};	
	await db.collection('ToDoList').deleteOne(deleteQuery);
	return callback();
}

Handle_delete = function(ID,res){
	console.log('...Welcome to delete page');
	const client = new MongoClient(mongourl);
	try{
		client.connect();
		console.log("Connected successfully to the DB server.");
		var db = client.db(dbName);
		deleteDoc(db,ID,function(result){
			client.close();
			console.log('delete completed');
			res.status(200).render('info',{infoMsg:'Delete completed'});
			
		});
	}
	catch(error){
		console.log(error);
	}	
}

app.get('/home',function(req,res){
	res.status(200).render('home');
});

//logout
app.get('/logout', function(req, res){
	req.session = null;
	res.redirect('/login');
});



//RESTFUL

//create
app.post('/api/item/id/:id',function(req,res){

	if(req.params.id){
		console.log(req.body);
		const client = new MongoClient(mongourl);
		try{
			client.connect();
			collection = client.db(dbName).collection('ToDoList');
			try{
				collection.insertOne(req.body);
				console.log('inserted');
			}
			catch(error){
				console.log(error)
			}
		}catch(error){
			console.log(error);
		}finally{
			client.close();
			console.log('connection closed');
		}
		
	}
	else{
		res.status(500).json({"error":"missing event ID"});
	}
});

//search
app.get('/api/item/id/:id',function(req,res){

	if(req.params.id){
		console.log(req.body);
		const client = new MongoClient(mongourl);
		try{
			client.connect();
			console.log('connected');
			db = client.db(dbName);
			searchQuery = {'id' : req.params.id};
			searchDoc(db,searchQuery,function(document){
				if(document == null){
					console.log('id not found');
					client.close();
					console.log('connection closed');
				}else{
					console.log('found');
					res.status(200).json(document);
					client.close();
					console.log('connection closed');
				}

			});
		}catch(error){
			console.log(error);
		}
		
	}else{
		res.status(500).json({"error": "missing event id"});
	}
})

//update
app.post('/api/item/update/id/:id',function(req,res){

	if(req.params.id){
		const client = new MongoClient(mongourl);
		try{
			client.connect();
			console.log(req.body);
			collection = client.db(dbName).collection('ToDoList');
			var DocToUpdate = {};
			try{
				collection.updateOne({"id":req.params.id},{$set:req.body});
			}
			catch(error){
				console.log(error);
			}
			finally{
				client.close();
				console.log('connection closed');
			}
		}catch(error){
			console.log(error);
		}
	}
	else{
		res.status(500).json({"error": "missing event id"});
	}
})

//delete
app.delete('/api/item/id/:id',function(req,res){

	if(req.params.id){
		const client = new MongoClient(mongourl);
		try{
			client.connect();
			console.log('connected');
			console.log('event to be delete :'+ req.params.id);
			deleteDoc(client.db(dbName),req.params.id,function(result){
				client.close();
				console.log('connection closed');
				console.log('delete completed');
			});
		}
		catch(error){
			console.log(error);
		}
		
	}else{
		res.status(500).json({"error": "missing event id"});
	}

})





//app.listen(app.listen(process.env.PORT || 8099));
