/**
 * Created by rohitkumar on 13/7/17.
 */
function check() {
    if ($('#phone').val() > 9999999999 || $('#phone').val() < 7000000000) {
        $('#phone').val('');
        alert('Please Enter Valid Phone Number');
    }
}

$('form').submit(function(e){
    e.preventDefault();
    $.post('/personal_details_next',{firstname: $('#firstname').val(),lastname: $('#lastname').val(),dob:$('#dob').val(),email:$('#email').val(),phone:$('#phone').val()},function(result){
        console.log(result);
        if(typeof result === "object"){
            result.forEach(function(x){
                $('#alert').append('<div class="alert alert-danger col-xs-11 col-sm-8 col-md-8 col-lg-6">'+
                    x.msg+'</div>');
            });
        }
        else {
            window.location.href="/address";
        }
    });
});



function fieldcheck(data) {
        if($(data).val() === "") {
            $(data).addClass('redplace');
            $(data).attr('placeholder',data.name+' is required! ');
        }
}

