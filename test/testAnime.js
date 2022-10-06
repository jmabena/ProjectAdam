var assert = require('assert');
const { Anime } = require('../model/Anime');
const { Profile } = require('../model/Profile');
const { Review } = require('../model/Review');
const axios = require('axios');
var myurl = 'http://localhost:3000'
const instance = axios.create({
    baseURL: myurl,
    timeout: 5000, //5 seconds max
    headers: {'content-type': 'application/json'}
});
describe('Test models', function () {
    describe('Profile', function () {
        let profile = 'jabuTest';
        let gender = 'male';
        let birthday = 'March 20 1999';
        let favorites = [];
        let link = 'http://localhost:3000';
        let password = "testPassword";
        let tProfile = new Profile(profile, gender, birthday,favorites,link, password);
        it('Test successful creation of profile', function () {
            assert.strictEqual(tProfile.profile,profile);
            assert.strictEqual(tProfile.gender,gender);
            assert.strictEqual(tProfile.birthday,birthday);
            assert.strictEqual(tProfile.favorites,favorites);
            assert.strictEqual(tProfile.link,link);
            assert.strictEqual(tProfile.password,password);
        })
    })
    describe('Review', function(){
        let uid = '123';
        let profile = 'jabuTest';
        let anime_uid = '28891';
        let text = 'text';
        let score = '9';
        let scores = '';
        let link = 'http://localhost:3000';
        let tReview = new Review(uid,profile,anime_uid,text,score,scores,link);
        it('test successful creation of review', function() {
            assert.strictEqual(tReview.uid,uid);
            assert.strictEqual(tReview.profile,profile);
            assert.strictEqual(tReview.anime_uid,anime_uid);
            assert.strictEqual(tReview.text,text);
            assert.strictEqual(tReview.score,score);
            assert.strictEqual(tReview.scores,scores);
            assert.strictEqual(tReview.link,link);
        })

    })
})
describe('Test all API calls',function(){
    describe('AnimesController',function(){
        it('Success 1. GET - /AnimesController returns an array of all anime', async function(){
            let result = await instance.get('/AnimesController');
            assert.strictEqual(result.data.length,19311);
        });
        it('Success 2. GET - /AnimesController/title/:name returns anime object matching name',async function(){
            let name = 'Gintama';
            let result = await instance.get('/AnimesController/title/'+name);
            assert.strictEqual(result.data[0].title.includes(name),true);
        })
        it('Success 3. GET - /AnimesController/uid/:uid returns anime object matching uid', async function(){
            let uid = '199';
            let result = await instance.get('/AnimesController/uid/'+uid);
            assert.strictEqual(result.data.uid,uid);
        })
        it('Success 4. GET - /AnimesController/genre/:genre',async function(){
            let genre = 'Comedy';
            let result = await instance.get('/AnimesController/genre/'+genre);
            assert.strictEqual(result.data[0][genre],'1');
        })
        it('Success 5. GET - /AnimesController/profiles returns a list of profiles', async function(){
            this.timeout(0);
            let result = await instance.get('/AnimesController/profiles');
            assert.strictEqual(result.data.length>=81727,true);
        })
        it('Success 6. GET - /AnimesController/profile/:profile returns profile matching profile name', async function(){
            let profile = 'camco';
            let result = await instance.get('/AnimesController/profile/'+profile);
            assert.strictEqual(result.data[0].profile,profile);
        })
        it('Success 7. GET - /AnimesController/gender/:gender returns profiles matching gender', async function(){
            let gender = 'Female';
            let result = await instance.get('/AnimesController/gender/'+gender);
            assert.strictEqual(result.data[0].gender,gender);
        })
        it('Success 8. POST - /AnimesController/profile/ returns a success or fail message for creating new profile',async function(){
            let profile = {
                profile: 'jabuTest',
                gender: 'Male',
                birthday: 'March 20 1999',
                favorites: [],
                link: '',
                password: 'TestPassword'
            }
            let result = await instance.post('/AnimesController/profile',profile);
            assert.strictEqual(result.data,'profile saved');
        })
        it('Success 9. POST - /AnimesController/profile/:profile/:password returns a profile upon successful login',async function(){
            let profile = 'jabuTest';
            let password = 'TestPassword';
            let result = await instance.post(`/AnimesController/profile/${profile}/${password}`);
            assert.strictEqual(result.data.profile,profile);
        })
        it('Fail 1. POST - /AnimesController/profile/:profile/:password returns a failure message when user enters wrong password', async function(){
            let profile = 'jabuTest';
            let password = 'testPassword';
            let result = await instance.post(`/AnimesController/profile/${profile}/${password}`);
            assert.strictEqual(result.data,'wrong password')
        })
        it('Success 10. POST - /AnimesController returns all anime sorted by given criteria ', async function(){
            let data = {sortBy: 'title', order: -1};
            let title = ''
            this.timeout(0);
            let result = await instance.post('/AnimesController',data);
            assert.strictEqual(result.data[0].title,'◯');
            
        })
        it('Success 11. POST - /AnimesController/review returns a success message upon review creation', async function(){
            let data = {uid: '123',
                profile: 'jabuTest',
                anime_uid: '28891',
                text: 'test review post',
                score: '8',
                scores: "{'Overall': '8', 'Story': '8', 'Animation': '8', 'Sound': '10', 'Character': '9', 'Enjoyment': '8'}"
            };
            let result = await instance.post('/AnimesController/review',data);
            assert.strictEqual(result.data,"reveiw added");
        })
        it('Success 12. PUT - /AnimesController/profile/:profile returns success message if profile updated', async function(){
            let profile = {
                profile: 'jabuTest',
                gender: 'Male',
                birthday: 'March 20 1998',
                favorites: "['5118']",
                link: '',
                password: 'TestPassword'
            }
            let result = await instance.put('/AnimesController/profile/'+profile.profile,profile);
            assert.strictEqual(result.data,"profile updated");
        })
        it('Success 13. delete - /AnimesController/profile/:profile returns success or fail message to show if profile is deleted',async function(){
            this.timeout(0);
            let profile = 'jabuTest';
            let result = await instance.delete('/AnimesController/profile/'+profile);
            assert.strictEqual(result.data,'Profile deleted')
        })
        it('Success 14. delete -/AnimesController/reviews/:uid returns success message upon successful review delete',async function(){
            this.timeout(0);
            let uid = '123';
            let result = await instance.delete('AnimesController/reviews/'+uid);
            assert.strictEqual(result.data,'Review deleted');
        })
    });
});