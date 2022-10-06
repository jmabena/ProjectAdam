const csvtojson = require('csvtojson');

//list of all anime genres;
const genres = ['Action','Adventure','Cars','Comedy','Dementia','Demons','Drama','Ecchi','Fanstasy','Game','Harem','Hentai','Historical','Horror','Josei','Kids','Magic','Martial Arts','Mecha','Military','Music','Mystery','Parody','Police','Psychological','Romance','Samura','School','Sci-Fi','Seinen','Shoujo','Shoujo Ai','Shounen','Shounen Ai','Slice of Life','Space','Sports','Super Power','Supernatural','Thriller','Vampire','Yaoi','Yuri'];

//promise to create animes collection and/or add data to it
async function loadAnimes(){
    console.log('loading anime')
    let animes = [];
    let client = require('./db.js');
    db = await client.getDb();
    let collection = await db.collection('animes');
    return new Promise((resolve,reject) =>{
        csvtojson().fromFile('animes_cleaned.csv').then(sources => {
    
        for(let i = 0; i < sources.length; i++) {
            
            let rOne = {
                uid: sources[i].uid,
                title: sources[i].title,
                synopsis: sources[i].synopsis,
                episodes: sources[i].episodes,
                members: sources[i].members,
                popularity: sources[i].popularity,
                ranked: sources[i].ranked,
                score: sources[i].score,
                img_url: sources[i].img_url,
                link: sources[i].link,
                Start: sources[i].Start,
                End: sources[i].End
            };
            for(let j = 0;j<genres.length;j++){
                let name = genres[j];
                rOne[name] = sources[i][name];
            }
            animes.push(rOne);
            
        }
        collection.insertMany(animes, (err, result) => {
            if(err) reject(err);
            if(result){
                resolve("anime data saved");
            }
        });
    });
    })
    
}
//promise to create profiles collection and/or add data to it
async function loadProfiles(){
    console.log('loading profiles')
    let profiles = [];
    let client = require('./db.js');
    db = await client.getDb();
    let collection = await db.collection('profiles');
    return new Promise((resolve, reject) => {
        csvtojson().fromFile('profiles.csv').then(sources => {
            for(let i = 0; i < sources.length; i++) {
                let rOne = {
                    profile: sources[i].profile,
                    gender: sources[i].gender,
                    birthday: sources[i].birthday,
                    favorites: sources[i].favorites_anime,
                    link: sources[i].link
                };
                profiles.push(rOne);
            }
            collection.insertMany(profiles, (err, result) => {
                if(err) reject(err);
                if(result){
                    resolve('profiles saved');
                }
            });
        });
    })
    
}

//promise to create reviews collection and/or add data to it
async function loadReviews(){
    console.log('loading reviews');
    let reviews = [];
    let client = require('./db.js');
    db = await client.getDb();
    let collection = await db.collection('reviews');
    return new Promise((resolve, reject) => {
        csvtojson().fromFile('./reviews1.csv').then(sources => {
    
            for(let i = 0; i < sources.length; i++) {
            let rOne ={
                uid: sources[i].uid,
                profile: sources[i].profile,
                anime_uid: sources[i].anime_uid,
                text: sources[i].text,
                score: sources[i].score,
                scores: sources[i].scores,
                link: sources[i].link
            };
            reviews.push(rOne);
        }
            collection.insertMany(reviews, (err, result) => {
                    if(err) reject(err);
                    if(result){
                        resolve('reviews saved');
                    }
            });
        });
    
    })
    
}

module.exports = {loadAnimes,loadProfiles,loadReviews}