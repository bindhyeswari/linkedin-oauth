/**
 * Created by bindhyeswarimishra on 2/9/16.
 */


$(function () {
    console.log('hello world from the linked in app');
    // check if the user is logged in ...
    $.ajax({
        url: '/account',
        success: function (data, status, jqXHR) {
            console.log(data);
            // user is authenticated
            $('#login-status').html('Hi there! What do you want to get done today?');
        },
        error: function (jqXHR) {
            if (jqXHR.status === 401) {
                // user is not authenticated
                $('#login-status').html('You are not logged in, please use the following button to login ... ');
            }
            console.log(jqXHR);
        }
    });
});


