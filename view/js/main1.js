user =(sessionStorage.getItem('user')) ? JSON.parse(sessionStorage.getItem('user')) : {};
loggedIn =(sessionStorage.getItem('loggedIn')) ? JSON.parse(sessionStorage.getItem('loggedIn')) : false;
let animes = {};
let limit = 50;
let index = 0;

$(document).ready(function(){
    user =(sessionStorage.getItem('user')) ? JSON.parse(sessionStorage.getItem('user')) : {};
    loggedIn =(sessionStorage.getItem('loggedIn') && user.profile) ? JSON.parse(sessionStorage.getItem('loggedIn')) : false;
    getAll();

    //get all anime objects from database
    function getAll(){
        $.ajax({
            url: '/AnimesController',
            type: 'GET',
            contentType: 'application/json',                        
            success: function(response){
                animes = response;
            },
            // If there's an error, we can use the alert box to make sure we understand the problem
            error: function(xhr, status, error){
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        }).done(function(){
            loadMoreData();
        })
        
    }

    //load more anime data to page
    function loadMoreData(){
        $('#charactersList').show();
        for(let i = 0; i < limit; i++){
            index = index + i;
            if(index >= animes.length) return;
            $('#charactersList').append(`<li class="character" value=${animes[index].uid}><h2>${animes[index].title}</h2><img src="${animes[index].img_url}"/></li>`);
            
            //`<li class="character><h2>${animes[index].title}</h2><img src="${animes[index].img_url}"></img></li>`
        }
        index++;
        
    }
    
    //scroll event listener to check for end of page and load more anime data
    $(window).scroll(function() {
        if($(document).height()-($(window).height()+$(window).scrollTop()) <= 50 & $('#charactersList').is(':visible')){
            loadMoreData();
            
        }
    });

    //listener for when enter key is pressed to search for anime matching passed name
    $("#searchBar").keypress(function(event){
        
        let code = (event.keyCode ? event.keyCode : event.which);
        if(code == '13'){
            $('#anime').remove();
            $("#charactersList").empty();
            index = 0;
            ind = 0;
            let name = $(searchBar).val();
            if(name == "") return;
            $.ajax({
                url: '/AnimesController/title/'+name,
                type: 'GET',
                contentType: 'application/json',                        
                success: function(response){
                    animes = response;
                },
                // If there's an error, we can use the alert box to make sure we understand the problem
                error: function(xhr, status, error){
                    var errorMessage = xhr.status + ': ' + xhr.statusText
                    alert('Error - ' + errorMessage);
                }
            }).done(function(){
                loadMoreData();
                $(searchBar).val('');
                
            })
        }
    })

    //check when genre button is clicked and load anime matching the genre
    $('.container').on('click', '.genre', function(){
        let genre = $(this).val();
        $("#charactersList").empty();
        index = 0;
        ind = 0;
        $.ajax({
            url: '/AnimesController/genre/'+genre,
            type: 'GET',
            contentType: 'application/json',                        
            success: function(response){
                animes = response;
                $('#anime').remove();
            },
            // If there's an error, we can use the alert box to make sure we understand the problem
            error: function(xhr, status, error){
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        }).done(function(){
            loadMoreData();
            
        })
    })
    
});
