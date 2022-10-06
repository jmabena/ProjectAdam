const genres = ['Action','Adventure','Cars','Comedy','Dementia','Demons','Drama','Ecchi','Fanstasy','Game','Harem','Hentai','Historical','Horror','Josei','Kids','Magic','Martial Arts','Mecha','Military','Music','Mystery','Parody','Police','Psychological','Romance','Samura','School','Sci-Fi','Seinen','Shoujo','Shoujo Ai','Shounen','Shounen Ai','Slice of Life','Space','Sports','Super Power','Supernatural','Thriller','Vampire','Yaoi','Yuri'];
let anime={}
let reviews=[];
let lim = 5;
let ind = 0;

$(document).ready(function(){








    /**
     * store our loaded anime into anime object
     * @param {Anime} obj anime object
     */
    function makeAnimeObject(obj){
        anime.uid = obj.uid;
        anime.title = obj.title;
        anime.synopsis = obj.synopsis;
        anime.episodes = Math.round(obj.episodes);
        anime.members = obj.members;
        anime.popularity = obj.popularity;
        anime.ranked = Math.round(obj.ranked);
        anime.score = obj.score;
        anime.img_url = obj.img_url;
        anime.link = obj.link;
        anime.Start = obj.start;
        anime.End = obj.End;
        let g = [];
        for(let genre of genres){
            if(obj[genre] == 1){
                g.push(genre)
            }
        }
        anime.genres = g
        getReviews(anime.uid);
    }

    /**
     * adding reviews to reviews list
     * @param {Review} obj 
     */
    function makeReviewObjects(obj){
        reviews = [];
        for(let o of obj){
            let review = {
                uid: o.uid,
                profile: o.profile,
                anime_uid: o.anime_uid,
                score: o.score,
                text: o.text
            }
            reviews.push(review);
        }
    }

    /**
     * 
     * loads more reviews to the page
     */
    function loadMoreReviews(){
        if(ind == 0 && reviews.length>0) {
            $("#anime").append(`<ul id="reviews"></ul>`)
        }
        for(let i = 0; i < lim; i++){
            ind = ind + i;
            if(ind >= reviews.length) return;
            $('#reviews').append(`<li class="review" value="${reviews[ind].uid}"></li>`);
            $('.review').append(`<p id='profile'>Profile: <span>${reviews[ind].profile}</span></p>`);
            $('.review').append(`<p id='score'>Score:<span>${reviews[ind].score}</span></p>`);
            $('.review').append(`<p id='rText'>${reviews[ind].text}</p>`);
            //`<li class="character><h2>${animes[index].title}</h2><img src="${animes[index].img_url}"></img></li>`
        }
        ind++;
        
    }

    /**
     * gets all reviews for anime matching anime_uid
     * @param {int} anime_uid 
     */
    function getReviews(anime_uid){
        $.ajax({
            url: '/AnimesController/reviews/anime_uid/'+anime_uid,
            type: 'GET',
            contentType: 'application/json',                        
            success: function(response){
                if(!response.includes("reviews not found for anime uid ")){
                    makeReviewObjects(response)
                }
                assemblePage();
            },
            // If there's an error, we can use the alert box to make sure we understand the problem
            error: function(xhr, status, error){
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        }).done(function(){
            
        })
    }

    /**
     * assembles the html elements to be displayed on the page
     */
    function assemblePage(){
        let uid = `<p id='uid'>${anime.uid}</p>`;
        let title = `<p id='title'>${anime.title}</p>`;
        let synopsis = `<p id='synopsis'>${anime.synopsis}</p>`;
        let episodes = `<div id='episodes'><p>Episodes: </p><p>${anime.episodes}</p></div>`;
        let members = `<div id='members'><p>Members: </p><p>${anime.members}</p></div>`;
        let popularity = `<div id='popularity'><p>Popularity: </p><p>${anime.popularity}</p></div>`;
        let ranked = `<div id='ranked'><p>Ranked: </p><p>${anime.ranked}</p></div>`;
        let score = `<div id='score'><p>Score: </p><p>${anime.score}</p></div>`;
        let img_url = `<img id='img_url' src='${anime.img_url}'/>`;
        let link = `<p id='link'>${anime.link}</p>`;
        let start = `<p id='start'>${anime.Start}</p>`;
        let end = `<p id='end'>${anime.End}</p>`;
        let genre ="";
        for(let i of anime.genres){
            genre += `<button class="genre" value="${i}">${i}</button>`
        }
        let genres = `<div id='genres'>${genre}</div>`;
        let html = uid + title + synopsis + episodes + members + popularity + ranked + score + img_url + link + start + end + genres;
        $('.container').append('<div id="anime"></div>');
        $('#anime').append(html);
        let user = JSON.parse(sessionStorage.getItem('user'));
        let loggedIn =(sessionStorage.getItem('loggedIn')) ? JSON.parse(sessionStorage.getItem('loggedIn')) : false;
        if(loggedIn && (!(user.favorites != null && user.favorites.includes(anime.uid)) )){
            $('#anime').append(`<button id="favButton" value="${anime.uid}">Add to Favorites</button>`);
        }
        if(loggedIn){
            $('#anime').append(`<button id="addReview" value=${anime.anime_uid}>Add Review</button>`);

        }
        loadMoreReviews();
        
    }
    /** 
     * event listener for the add review button
     */
    $('.container').on("click","#addReview",function(){
        $('#anime').hide();
        let addReview = `<div id="reviewDiv"></div>`;
        let text = `<label for="textInput">review</label><input type="text" id="textInput" name="textInput">`;
        let score = `<label for="reviewScore">Score</label><input type="text" id=reviewScore" name="reviewScore">`;
        let submit = `<button id="submitReview">add review</button>`;
        $('.container').append(`<form id="reviewForm"></form>`);
        $("#reviewForm").append(text)
        $("#reviewForm").append(score)
        $("#reviewForm").append(submit)
    });

    //event listener for the submitReview button click which submits a review
    $(".container").on("click","#submitReview",function(){
        let uid = Math.floor(Math.random() * 20000);
        let profile = user.profile;
        let anime_uid = anime.uid;
        let text = $("#textInput").val();
        let review = {
            uid: uid,
            profile: profile,
            anime_uid: anime_uid,
            text: text,
            score: $("#reviewScore").text(),
            link: ""
        }
        alert(review.text);
        $.ajax({
            url: `/AnimesController/review`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(review),
            success: function(response){
                if(response == "reveiw added"){
                    reviews.push(review);
                    $("#anime").show();
                }
                else{
                    alert(response);
                }
            },        
            //We can use the alert box to show if there's an error in the server-side
            error: function(xhr, status, error){
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        });
        
    })

    //event listener for when an anime is clicked to then display the anime
    $("#charactersList").on('click', '.character', function(){

        let uid = $(this).val()
        $('#charactersList').hide();
        $.ajax({
            url: '/AnimesController/uid/'+uid,
            type: 'GET',
            contentType: 'application/json',                        
            success: function(response){
                makeAnimeObject(response)
            },
            // If there's an error, we can use the alert box to make sure we understand the problem
            error: function(xhr, status, error){
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        }).done(function(){
            
        })
    })

    //event listener for the favButton which adds the anime to favorites
    $('.container').on('click', '#favButton', function(){
        let uid = $(this).val();
        let user = JSON.parse(sessionStorage.getItem('user'));
        //let str = user.favorites;
        if(user.favorites == null){
            user.favorites = [uid];
        }
        else{
            user.favorites.push(uid)
        }
        //user.favorites = str.slice(0,str.length-1) + ' ,' + uid + str.slice(str.length-1);

        $.ajax({
            url: `/AnimesController/profile/${user.profile}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(user),
            success: function(response){
                if(response == "profile updated"){
                    $("#favButton").hide();
                    sessionStorage.setItem('user',JSON.stringify(user));
                }
            },        
            //We can use the alert box to show if there's an error in the server-side
            error: function(xhr, status, error){
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        });  

    })

    //scroll event listener to check when user reached end of page and load more reviews
    $(window).scroll(function() {
        if($(document).height()-($(window).height()+$(window).scrollTop()) <= 50 & $('#anime').is(':visible')){
            loadMoreReviews();
            
        }
    });

    
})