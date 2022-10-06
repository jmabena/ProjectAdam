const client = require('../utils/db.js');

const genres = ['Action','Adventure','Cars','Comedy','Dementia','Demons','Drama','Ecchi','Fanstasy','Game','Harem','Hentai','Historical','Horror','Josei','Kids','Magic','Martial Arts','Mecha','Military','Music','Mystery','Parody','Police','Psychological','Romance','Samura','School','Sci-Fi','Seinen','Shoujo','Shoujo Ai','Shounen','Shounen Ai','Slice of Life','Space','Sports','Super Power','Supernatural','Thriller','Vampire','Yaoi','Yuri'];

async function _getAnimeCollection(){
    let db = await client.getDb();
    
    return db.collection('animes');
}

class Anime{
    constructor(uid,title,synopsis,episodes,members,popularity,ranked,score,img_url,link,Start,End){
        this.uid = uid;
        this.title = title;
        this.synopsis = synopsis;
        this.episodes = episodes;
        this.members = members;
        this.popularity = popularity;
        this.ranked = ranked;
        this.score = score;
        this.img_url = img_url;
        this.link = link;
        this.Start = Start;
        this.End = End;
    }

    async save(){
        try{
            let collection = await _getAnimeCollection();
            let obj = await collection.insertOne(this);
            console.log("inserted anime");
            return "anime inserted"
        } catch(e){
            throw e;
        }
    }

    /**
     * @returns {Array[Anime]} array of all Anime objects in database
     */
    static async getAll(sort='',order=-1){
        let collection = await _getAnimeCollection();
        if(sort != ''){
            return await collection.find({}).sort({[sort]: order}).toArray();
        }
        return await collection.find({}).toArray();
    }

    /**
     * gets all anime matching the specified name
     * @param {String} name name of anime
     * @returns {Array[Anime]} array of all anime objects containing name
     */
    static async get(name,sort='',order=-1){
        let collection = await _getAnimeCollection();
        if(sort != ''){
            return await collection.find({"title":{$regex:name , $options: 'i'}, $orderby:{[sort]: order}}).toArray();
        }
        return await collection.find({"title":{$regex:name , $options: 'i'}}).toArray();
    }

    /**
     * gets all anime matching the specified uid
     * @param {String} uid anime uid
     * @returns {Array[Anime]} array of all anime objects matching uid
     */
    static async getByUid(uid){
        let collection = await _getAnimeCollection();
        return await collection.find({uid:uid}).toArray();
    }

    /**
     * gets alll anime that have the specified genre
     * @param {String} genre anime genre
     * @returns {Array[Anime]} array of all anime with a genre tag matching genre
     */
    static async getByGenre(genre){
        let collection = await _getAnimeCollection();
        return await collection.find({[genre]: '1'}).toArray();
    }

    /**
     * function to return all anime uid to be used in validating posts from client
     * @returns {Array[uid]} returns an array of all anime uids
     */
    static async getAllUids(){
        let collection = await _getAnimeCollection();
        return await collection.find({}).project({uid:1 , _id: 0}).toArray();
    }

    getGenreList() {
        return genres;
    }
}

module.exports.Anime = Anime;
    
