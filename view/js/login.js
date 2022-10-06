$(document).ready(function(){ 
    //login button click event handler to login user
    $("#btnLogin").click(function(event){
        event.preventDefault();
        let userName = $('#name').val() 
        let password = $('#password').val()
        $.ajax({
            url: `/AnimesController/profile/${userName}/${password}`,
            type: 'POST',
            contentType: 'application/json',
            success: function(response){
                // We can print in the front-end console to verify
                // what is coming back from the server side
                if(response != 'wrong password' && response != 'user not found'){
                    sessionStorage.setItem('user',JSON.stringify(response));
                    sessionStorage.setItem('loggedIn','true');
                    location.replace("http://localhost:3000")
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
    });
})