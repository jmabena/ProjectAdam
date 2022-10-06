const client = require('../utils/db.js');
const Anime = require('../model/Anime.js').Anime;
const Profile = require('../model/Profile.js').Profile;
const Review = require('../model/Review.js').Review;


// module.exports.addAnime = async (req,res) => {
//     let uid = req.body.uid;
//     let title = req.body.title;
//     let synopsis = req.body.synopsis;
//     let genre = req.body.genre;
//     let aired = req.body.aired;
//     let episodes = req.body.episodes;
//     let members = req.body.members;
//     let popularity = req.body.popularity;
//     let ranked = req.body.ranked;
//     let score = req.body.score;
//     let img_url = req.body.img_url;
//     let link = req.body.link;
//     let newAnime = new Anime(uid, title, synopsis, synopsis,genre,aired, episodes, members, popularity,ranked, score, img_url, link);
//     let msg = await newAnime.save();
//     res.send(msg);
// }

/**
 * function to list all Animes
 * @param {Request} req 
 * @param {Response} res 
 */
module.exports.allAnime = async(req, res) => {
    let anime;
    if(req.body.sortBy != null){
        if(req.body.order != null){
            anime = await Anime.getAll(req.body.sortBy,req.body.order);

        }
        else{
            anime = await Anime.getAll(req.body.sortBy);
        }
    }
    else{
        anime = await Anime.getAll();
    }
    console.log(anime.length + "items sent");
    res.send(anime);
}

/**
 * function to get anime by name 
 * @param {Request} req 
 * @param {Response} res 
 */
module.exports.getAnime = async(req, res) => {
    let animeName = req.params.name;
    let anime;
    if(req.body.sortBy != null){
        if(req.body.order != null){
            anime = await Anime.get(animeName,req.body.sortBy,req.body.order);

        }
        else{
            anime = await Anime.get(animeName,req.body.sortBy);
        }
    }
    else{
        anime = await Anime.get(animeName);
    }
    if(anime.length > 0) {
        console.log(anime.length + 'anime found');
        res.send(anime);
    }
    else{
        res.send("anime not found");
    }
}

/**
 * function to get anime matching anime uid
 * @param {Request} req 
 * @param {Response} res 
 */
module.exports.getAnimeByUid = async(req, res) => {
    let animeUid = req.params.uid;
    let anime = await Anime.getByUid(animeUid);
    if(anime.length > 0) {
        console.log(anime.length + 'anime found');
        res.send(anime[0]);
    }
    else{
        res.send("anime not found");
    }
}

/**
 * function to get anime matching genre
 * @param {Request} req 
 * @param {Response} res 
 */
module.exports.getAnimeByGenre = async(req, res) => {
    let genre = req.params.genre;
    let anime = await Anime.getByGenre(genre);
    if(anime.length > 0) {
        console.log(anime.length + 'anime found from genre');
        res.send(anime);
    }
    else{
        console.log("not found genre");
        res.send("anime not found");
    }
}

/**
 * function to get all anime uids
 * @param {Request} req 
 * @param {Response} res 
 */
module.exports.allUids = async(req, res) => {
    let obj = await Anime.getAllUids();
    res.send(obj);
}

/**
 * function to get all profiles
 * @param {Request} req 
 * @param {Response} res 
 */
module.exports.allProfiles = async(req, res) => {
    let profile = await Profile.getAll();
    console.log(profile.length + 'profiles found');
    res.send(profile);
}

/**
 * function to get profiles matching profile name
 * @param {Request} req 
 * @param {Response} res 
 */
module.exports.getProfile = async(req, res) => {
    let pname = req.params.profile;
    let profile = await Profile.get(pname);
    if(profile.length > 0) {
        console.log(profile.length + 'profile found');
        res.send(profile);
    }
    else{
        res.send("profile not found");
    }
}

/**
 * function to get all profiles matching gender
 * @param {Request} req 
 * @param {Response} res 
 */
module.exports.getProfileByGender = async(req, res) => {
    let gender = req.params.gender;
    let profile = await Profile.getByGender(gender);
    if(profile.length > 0){
        console.log(profile.length + 'profile found');
        res.send(profile);
    }
    else{
        res.send("profile not found");
    }
}

/**
 * function to get all reviews
 * @param {Request} req 
 * @param {Response} res 
 */
module.exports.allReviews = async(req, res) => {
    let reviews = await Review.getAll();
    console.log(reviews.length + ' reviews found');
    res.send(reviews);
}

module.exports.getReviewsByAnimeUid = async(req, res) =>{
    let anime_uid = req.params.anime_uid;
    let reviews = await Review.get(anime_uid);
    if(reviews.length > 0){
        console.log(reviews.length + ' reviews found for anime_uid: ' + anime_uid);
        res.send(reviews);
    } 
    else{
        res.send("reviews not found for anime uid " + anime_uid);
    }
}

/**
 * function to get all reviews matching uid
 * @param {Request} req 
 * @param {Response} res 
 */
module.exports.getReviewByUid = async(req, res) =>{
    let uid = req.params.uid;
    let reviews = await Review.getByUid(uid);
    if(reviews.length > 0){
        console.log(reviews.length + ' reviews found');
        res.send(reviews);
    }
    else{
        res.send("reviews not found for uid " + uid);
    }
}

/**
 * function to get all reviews matching score
 * @param {Request} req 
 * @param {Response} res 
 */
module.exports.getReviewByScore = async(req, res) =>{
    let score = req.params.score;
    let reviews = await Review.getByScore(score);
    if(reviews.length >0){
        console.log(reviews.length + 'reviews found');
        res.send(reviews);
    }
    else{
        res.send("no reviews with score " + score);
    }
}

/**
 * function to get all reviews from given profile
 * @param {Request} req 
 * @param {Response} res 
 */
module.exports.getReviewByProfile = async(req, res) => {
    let profile = req.params.profile;
    let reviews = await Review.getByProfile(profile);
    if(reviews.length > 0){
        console.log(reviews.length + 'reviews found');
        res.send(reviews);
    }
    else{
        res.send("no reviews by " + profile)
    }
}

/**
 * function to get all profileNames
 * @param {Request} req 
 * @param {Response} res 
 */
module.exports.allProfileNames = async(req, res) => {
    let obj = await Profile.getAllProfiles();
    res.send(obj);
}

/**
 * function to get all review uids
 * @param {Request} req 
 * @param {Response} res 
 */
module.exports.allReviewUids = async(req, res) =>{
    let obj = await Review.getAllUids();
    if(obj.length > 0){
        console.log(obj.length + 'review uids found')
        res.send(obj);
    }
    else{
        console.log('no review uids found')
        res.send(obj)
    }
    
}

/**
 * function to update a review
 * @param {Request} req 
 * @param {Response} res 
 */
module.exports.updateReview = async(req, res) => {
    let uid = req.params.uid;
    let nReview = req.body;
    let msg = await Review.update(uid, new Review(nReview.uid,nReview.profile,nReview.anime_uid,nReview.text,nReview.score,nReview.scores,nReview.link));
    console.log(msg);
    res.send(msg);
}

/**
 * function to update a profile
 * @param {Request} req 
 * @param {Response} res 
 */
module.exports.updateProfile = async(req, res) => {
    let profile = req.params.profile;
    let nProfile = req.body;
    let msg = await Profile.update(profile, new Profile(nProfile.profile,nProfile.gender,nProfile.birthday,nProfile.favorites,nProfile.link,nProfile.password));
    console.log(msg);
    res.send(msg);
}

/**
 * function to add a review 
 * @param {Request} req 
 * @param {Response} res 
 */
module.exports.addReview = async(req, res) => {
    let review = req.body;
    let r = await new Review(review.uid,review.profile,review.anime_uid,review.text,review.score,review.scores,review.link)
    let msg = await r.save();
    res.send(msg);
}

/**
 * function to add a profile
 * @param {Request} req 
 * @param {Response} res 
 */
module.exports.addProfile = async(req, res) => {
    let profile = req.body;
    let p = new Profile(profile.profile,profile.gender,profile.birthday,profile.favorites,profile.link,profile.password);
    let msg = await p.save();
    res.send(msg);
}

/**
 * function to login a user
 * @param {Request} req 
 * @param {Response} res 
 */
module.exports.profileLogin = async(req, res) => {
    let profile = req.params.profile;
    let password = req.params.password;
    let login = await Profile.login(profile,password);
    res.send(login);
    
}

/**
 * function to delete a review
 * @param {Request} req 
 * @param {Response} res 
 */
module.exports.deleteReview = async(req, res) => {
    let uid = req.params.uid;
    let msg = await Review.delete(uid);
    res.send(msg);
}

/**
 * function to delete a profile
 * @param {Request} req 
 * @param {Response} res 
 */
module.exports.deleteProfile = async(req, res) => {
    let profile = req.params.profile;
    let msg = await Profile.delete(profile);
    res.send(msg)
}