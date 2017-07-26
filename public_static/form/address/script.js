/**
 * Created by rohitkumar on 13/7/17.
 */

$('form').submit(function(e){
    e.preventDefault();
    console.log('submit');
    $.post('/address_details_next', {
        address: $('#address1').val() + " " + ($('#address2').val() ? ($('#address2').val()) : ('')),
        city: $('#city').val(),
        state: $('#state').val(),
        pincode: $('#pinCode').val()
    }, function (result) {
        console.log(result);

        if(typeof result === "object") {
            result.forEach(function(x){
                $('#alert').append('<div class="alert alert-danger col-xs-11 col-sm-8 col-md-8 col-lg-6">'+
                    x.msg+'</div>');
            });
        }

        else {
            window.location.href = "/education";
        }

    });
});



function fieldcheck(data) {
    if($(data).val() === "") {
        $(data).addClass('redplace');
        $(data).attr('placeholder',data.name+' is required! ');
    }
}
