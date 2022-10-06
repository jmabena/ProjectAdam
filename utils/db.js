const MongoClient = require("mongodb").MongoClient
const uri ="mongodb://localhost:27017";
const client = new MongoClient(uri, { useUnifiedTopology: true });
const loadDb = require('./LoadDb.js')
var db;
var colls = [];
/**
 * A function to stablish a connection with a MongoDB instance.
 */
async function connectToDB() {
    try {
        // Connect the client to the server
        await client.connect();
        
        db = await client.db('Animesdb');
        await _checkCollections();
        await _loadCollections();
        console.log("Connected successfully to mongoDB");  
    } catch (err) {
        throw err; 
    }
}

/**
 * This method just returns the database instance
 * @returns A Database instance
 */
async function getDb() {
    return db;
}

async function closeDBConnection(){
    await client.close();
    return 'Connection closed';
};

/**
 *method to check if collections exist in database
 */
async function _checkCollections(){
    //for some reason not doing this would result in the promises not being fulfilled
    return new Promise((resolve,reject) =>{
        let checked = false;
        db.listCollections().toArray(function(err,names){
            if(!err){
                names.forEach(element => {
                    colls.push(element.name)
                });
                checked = true;
                resolve('checked');
            }
            else{
                reject('cannot check');
            }
        });
        
    })
    
}

/**
 * method to create and load data to collections if they currently do not exist
 */
async function _loadCollections(){
    if(!colls.includes('animes')){
        try {
            let anime = await loadDb.loadAnimes();
            console.log('animes collection created');
        } catch (error) {
            throw error
        }
    }
    if(!colls.includes('profiles')){
        try {
            let profile = await loadDb.loadProfiles();
            console.log('profiles collection created');
        } catch (error) {
            throw error
        }
    }
    if(!colls.includes('reviews')){
        try {
            let review = await loadDb.loadReviews();
            console.log('reviews collection created')
        } catch (error) {
            throw error
        }
    } 
    
}


module.exports = {connectToDB, getDb, closeDBConnection}