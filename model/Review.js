const client = require('../utils/db.js');

async function _getReviewsCollection(){
    let db = await client.getDb();
    return db.collection('reviews');
}

class Review{
    constructor(uid,profile,anime_uid,text,score,scores,link){
        this.uid = uid;
        this.profile = profile;
        this.anime_uid = anime_uid;
        this.text = text;
        this.score = score; 
        this.scores = scores;
        this.link = link;
    }

    async save(){
        try{
            let collection = await _getReviewsCollection()
            let r = this.uid;
            let check = await this.constructor.getByUid(r);
            if(check.length>0){
                return 'review exists'
            }
            let object = await collection.insertOne(this);
            console.log("review added");
            return "reveiw added"
        } catch(err){
            throw err;
        }
    }

    static async update(uid,nReview){
        let collection = await _getReviewsCollection
        let newReview = await {$set: {'uid': nReview.uid,'profile':nReview.profile,'anime_uid':nReview.anime_uid,'text': nReview.text,'score':nReview.score,'scores':nReview.scores,'link':nReview.link}};
        let object = await collection.updateOne({'uid':uid},newReview);
        if(obj.modifiedCount >0){
            return "review updated";
        }
        else return "cannot update review";
    }

    /**
     * 
     * @returns {Array[Reviews]} returns an array of all review objects in the database
     */
    static async getAll(sort='',order=-1){
        let collection = await _getReviewsCollection();
        if(sort != ''){
            return await collection.find({}).sort({[sort]:order}).toArray();
        }
        return await collection.find({}).toArray();
    }


    /**
     * method returns an array of all reviews of the anime given by the uid
     * @param {String} anime_uid 
     * @returns {Array[Reviews]} returns an array of all review objects in the database for the given anime_uid
     */
    static async get(anime_uid,sort='',order=-1){
        let collection = await _getReviewsCollection();
        if(sort != ''){
            return collection.find({anime_uid:anime_uid,$orderby: {[sort] : order}}).toArray();
        }
        return collection.find({anime_uid:anime_uid}).toArray();

    }

    /**
     * 
     * @param {String} score 
     * @returns {Array[Reviews]} returns array of reviews matchinng score
     */
    static async getByScore(score){
        let collection = await _getReviewsCollection();
        return await collection.find({score:score}).toArray();
    }


    /**
     * 
     * @param {String} uid 
     * @returns returns an array of all reviews matching uid
     */
    static async getByUid(uid){
        let collection = await _getReviewsCollection();
        return collection.find({uid:uid}).toArray();
    }

    /**
     * 
     * @param {String} profile 
     * @returns {Array[Reviews]} returns an array of all reviews from this profile
     */
    static async getByProfile(profile){
        let collection = await _getReviewsCollection();
        return collection.find({profile:profile}).toArray();
    }

    /**
     * function to return all review uid to be used in validating posts from client
     * @returns {Array[uid]} returns an array of all review uids
     */
     static async getAllUids(){
        let collection = await _getReviewsCollection();
        return await collection.find({}).project({uid:1 , _id: 0}).toArray();
    }

    /**
     * 
     * @param {String} uid 
     * @returns {String} returns a string to indicate if review was deleted or not
     */
    static async delete(uid){
        let collection = await _getReviewsCollection();
        let obj = await collection.deleteOne({uid:uid});
        if(obj.deletedCount > 0){
            return 'Review deleted'
        }
        else{
            return 'Review not found'
        }
    }

}

module.exports.Review = Review;