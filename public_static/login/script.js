/**
 * Created by rohitkumar on 11/7/17.
 */

$(window).on('load', function(){
    setTimeout(removeLoader, 1000); //wait for page load PLUS two seconds.
});

function removeLoader(){
    $( "#loader" ).fadeOut(500, function() {
        // fadeOut complete. Remove the loading div
        $( "#loader" ).remove(); //makes page more lightweight
    });
}

$('#loginButton').click(function () {
    $('.loginInput').removeClass('display');
    $('.signInput').addClass('display');
    $(this).addClass('greenButton');
    $('#signupButton').removeClass('greenButton');
});

$('#signupButton').click(function () {
    $('.signInput').removeClass('display');
    $('div.loginInput').addClass('display');
    $(this).addClass('greenButton');
    $('#loginButton').removeClass('greenButton');
});

var pass = $('#signPass');
var repass = $('#resignPass');
var email = $('#signEmail');

function checkfield(){
    if(pass.val() !== repass.val()) {
        repass.val('');
        repass.attr('placeholder','Password do not match ! ');
    }
}

$('#login').submit(function(e){
    $.post('/login',function(result){
        console.log(result);
    });
});

$('#signup').submit(function(e){
    e.preventDefault();
    $.post('sign_up',{email:email.val(),password:pass.val(),repassword:repass.val()},function(result){
        console.log(result);
        if(typeof result === "object"){
            result.forEach(function(x){
                $('#alert').append('<div class="alert alert-danger col-xs-11 col-sm-8 col-md-8 col-lg-6">'+
                    x.msg+'</div>');
            });
        }
        else{
            window.location.href="/success";
        }
        // else {
        //     $('#alert').append('<div class="alert alert-danger col-xs-11 col-sm-8 col-md-8 col-lg-6">'+
        //         result+'</div>');
        // }

    })
});