const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());// support json encoded bodies
app.use(express.urlencoded({extended: true}));//incoming objects are strings or arrays
app.use(express.static(__dirname + '/view'));

const animeC = require('./controller/AnimesController');// Here we import our code with the contacts operations
const mongo = require('./utils/db.js');

var server;

async function createServer(){
  try {
    //connect to database
    await mongo.connectToDB();
    // anime resource paths
    app.get('/AnimesController', animeC.allAnime);//get all anime in default order
    app.get('/AnimesController/title/:name', animeC.getAnime);//get anime containing name
    app.get('/AnimesController/uid/:uid', animeC.getAnimeByUid);//get anime matching uid
    app.get('/AnimesController/genre/:genre', animeC.getAnimeByGenre);//get anime withing genre
    app.get('/AnimesController/allUids',animeC.allUids);//get all anime uids
    app.post('/AnimesController',animeC.allAnime);//get all anime in defined sorting order
    app.post('/AnimesController/title/:name', animeC.getAnime);//get anime matching name in defined sorting order
    // profile resource paths
    app.get('/AnimesController/profiles',animeC.allProfiles);//get all profile
    app.get('/AnimesController/profile/:profile', animeC.getProfile);//get all profiles matching profile name
    app.get('/AnimesController/gender/:gender',animeC.getProfileByGender)//get all profiles with given gender
    app.get('/AnimesController/profiles/allProfiles', animeC.allProfileNames);//get all profile names
    app.put('/AnimesController/profile/:profile', animeC.updateProfile);//update profile
    app.post('/AnimesController/profile',animeC.addProfile);//create a profile
    app.post('/AnimesController/profile/:profile/:password',animeC.profileLogin);//user login to profile
    app.delete('/AnimesController/profile/:profile',animeC.deleteProfile);//delete profile
    //review resource paths
    app.get('/AnimesController/reviews',animeC.allReviews);//get all reviews
    app.get('/AnimesController/reviews/anime_uid/:anime_uid', animeC.getReviewsByAnimeUid);//get all reviews for anime matching uid
    app.get('/AnimesController/reviews/:uid',animeC.getReviewByUid);//all reviews matching uid
    app.get('/AnimesController/reviews/profile/:profile',animeC.getReviewByProfile);//get reviews from this profile
    app.get('/AnimesController/reviews/score/:score',animeC.getReviewByScore);//get reviews with this score
    app.get('/AnimesController/review/allUids',animeC.allReviewUids);//get all review uids
    app.put('/AnimesController/reviews/:uid',animeC.updateReview);//update review
    app.post('/AnimesController/review',animeC.addReview);//create review
    //app.post('/AnimesController/reviews',animeC.allReviews);//get all reviews in defined sorting order
    //app.post('/AnimesController/reviews/anime_uid/:uid', animeC.getReviewsByAnimeUid);//get all reviews for anime matching uid in defined sorting order
    app.delete('/AnimesController/reviews/:uid', animeC.deleteReview);//delete a review
   
   
    server = app.listen(port, () => {
      console.log('Example app listening at http://localhost:%d', port);
    });
  }catch(err){
    console.log(err)
  }
}
createServer();

process.on('SIGINT', () => {
  console.info('SIGINT signal received.');
  console.log('Closing Mongo Client.');
  server.close(async function(){
    let msg = await mongo.closeDBConnection()   ;
    console.log(msg);
  });
});
