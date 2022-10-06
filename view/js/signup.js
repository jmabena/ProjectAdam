$(document).ready(function(){
    /**
     * This function will get all the values in the inputs
     * and will create a valid object to be send to the server-side
     */
    function assembleProfile(){ 
        let p = {};
        p.profile = $("#name").val();
        p.gender = 'male'; //idk how to get values from radio buttons so i defaulted it to male for now
        p.birthday = $('#birthday').val()
        p.favorites = [];
        p.link = '';
        p.password = $('#password').val()
        return p;
    }
    /**
     * This function binds an event to the add button.
     * The idea is that we assemble a valid object from the form
     * and send it to the server-side.
     */
    $("#btnAdd").click(function(event){ 
        event.preventDefault();
        let profile = assembleProfile();
        $.ajax({
            url: '/AnimesController/profile',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(profile),
            success: function(response){
                // We can print in the front-end console to verify
                // what is coming back from the server side
                //console.log(JSON.stringify(response));  
                console.log(response) 
                $("#add-out").text(response); 
                location.replace("http://localhost:3000/login.html")
            },        
            //We can use the alert box to show if there's an error in the server-side
            error: function(xhr, status, error){
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        });
        
    });
});