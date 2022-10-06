const client = require('../utils/db.js');
const bcrypt = require('bcrypt');
async function _getProfilesCollection(){
    let db = await client.getDb();
    return db.collection('profiles');
}

class Profile{
    constructor(profile,gender,birthday,favorites,link,password){
        this.profile = profile;
        this.gender = gender;
        this.birthday = birthday;
        this.favorites = favorites;
        this.link = link;
        this.password = password;
    }

    /**
     * 
     * save new profile to database
     */
    async save(){
        try{
            let collection = await _getProfilesCollection();
            let p = this.profile;
            let check = await this.constructor.get(p);
            if(check.length>0){
                return 'profile exists'
            }
            this.password = await bcrypt.hash(this.password,10);
            let obj = await collection.insertOne(this);
            console.log("saved profile");
            return "profile saved"
        }catch(e){
            throw e;
        }
    }

    // update profile
    static async update(profile,nProfile){
        let collection = await _getProfilesCollection();
        let check = await this.get(profile);
        if(check.length>0){
            let nPassword;
            if(await bcrypt.compare(nProfile.password,check[0].password)){
                nPassword = check[0].password;
            }
            else nPassword = await bcrypt.hash(nProfile.password,10);
            let newProfile = {$set: {'profile':nProfile.profile,'gender':nProfile.gender,'birthday':nProfile.birthday,'favorites': nProfile.favorites,'link': nProfile.link, password: nPassword}};
            let obj = await collection.updateOne({'profile':profile},newProfile);
            if(obj.modifiedCount>0){
                return "profile updated";

            }
            else return "profile not saved";
        }else return "profile not"
        
    }

    /**
     * 
     * @param {String} profile profile name
     * @param {String} password profle password
     * @returns {Profile} returns a profile if user successfully logged in
     */
    static async login(profile,password){
        let user = await this.get(profile);
        if(user.length >0){
            if(user[0].password!=null){
                try {
                    if(await bcrypt.compare(password,user[0].password)){
                        
                        return user[0];
                    }else{
                        return 'wrong password';
                    }
                    
                } catch (error) {
                    throw error
                }
            }
        }
        else{
            return 'user not found';
        }
        
    }

    /**
     * 
     * @param {String} profile 
     * @returns {String} returns message of success or failure to delete profile
     */
    static async delete(profile){
        let collection = await _getProfilesCollection();
        let obj = await collection.deleteOne({'profile':profile});
        if(obj.deletedCount > 0){ 
            return 'Profile deleted'
        }else{
            return 'cannot find profile'
        }
    }

    /**
     * gets all profile objects from the database
     * @returns {Array[Profile]} returns an array of Profile objects
     */
    static async getAll(){
        let collection = await _getProfilesCollection();
        return await collection.find({}).toArray();
    }

    /**
     * 
     * @param {String} profile 
     * @returns {Array[Profile]} returns an array of Profile objects matching the profile name
     */
    static async get(profile){
        let collection = await _getProfilesCollection();
        return await collection.find({'profile':profile}).toArray();
    }

    /**
     * 
     * @param {String} gender 
     * @returns {Array[Profile]} returns an array of Profile objects matching gender
     */
    static async getByGender(gender){
        let collection = await _getProfilesCollection();
        return await collection.find({'gender':gender}).toArray();
    }

    /**
     * function to return all profile names to be used in validating posts from client
     * @returns {Array[profile]} returns an array of all profile names
     */
     static async getAllProfiles(){
        let collection = await _getProfilesCollection();
        return await collection.find({}).project({profile:1 , _id: 0}).toArray();
    }

}

module.exports.Profile = Profile;