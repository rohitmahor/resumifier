/**
 * Created by rohitkumar on 13/7/17.
 */
function year(selector){
    var max = new Date().getFullYear(),
        min = max - 50,
        // max = max+5;
        select = $(selector);

    for (var i = min; i<=max; i++){
        select.append('<option value="'+i+'">'+i+'</option>');
    }
}

function endYear(selector){
    var max = new Date().getFullYear(),
        min = max - 50,
        max = max+5;
        select = $(selector);

    for (var i = min; i<=max; i++){
        select.append('<option value="'+i+'">'+i+'</option>');
    }
}

year('#completion');
year('#sen-completion');
// endYear('#grad-end-year');

year('#grad-start-year');
endYear('#grad-end-year');

year('#post-grad-start-year');
endYear('#post-grad-end-year');

year('#phd-start-year');
endYear('#phd-end-year');

// function submitForm(details,route){}
$('#secondary_details').submit(function(e){
   e.preventDefault();
   $.post('/secondary_details',{completion:$('#completion').val(),board:$('#board').val(),scale:$('#scale').val(),performance:$('#performance').val(),school:$('#school').val()},function(result){
       console.log(result);
       // $('#board').val('');$('#performance').val('');$('#school').val('');
   });
    $('#secondary-modal').modal('hide');
    $('#plus1').addClass('display');
    $('#check1').removeClass('display');
    $('#plus_check1').addClass('green');
});

$('#sen_secondary_details').submit(function(e){
    e.preventDefault();
    $.post('/sen_secondary_details',{completion:$('#sen-completion').val(),board:$('#sen-board').val(),scale:$('#sen-scale').val(),performance:$('#sen-performance').val(),school:$('#sen-school').val()},function(result){
        console.log(result);
        // $('#sen-board').val('');$('#sen-performance').val('');$('#sen-school').val('');
    });
    $('#sen-secondary-modal').modal('hide');
    $('#plus2').addClass('display');
    $('#check2').removeClass('display');
    $('#plus_check2').addClass('green');
});

$('#graduation_details').submit(function(e){
    e.preventDefault();
    $.post('/graduation_details',{college:$('#graduation-school').val(),start:$('#grad-start-year').val(),end:$('#grad-end-year').val(),scale:$('#grad-scale').val(),performance:$('#grad-performance').val(),degree:$('#grad-degree').val()},function(result){
        console.log(result);
        // $('#graduation-school').val('');$('#grad-performance').val('');$('#grad-degree').val('');
    });
    $('#graduation-modal').modal('hide');
    $('#plus3').addClass('display');
    $('#check3').removeClass('display');
    $('#plus_check3').addClass('green');
});

$('#post_graduation_details').submit(function(e){
    e.preventDefault();
    $.post('/post_graduation_details',{college:$('#post-graduation-school').val(),start:$('#post-grad-start-year').val(),end:$('#post-grad-end-year').val(),scale:$('#post-grad-scale').val(),performance:$('#post-grad-performance').val(),degree:$('#post-grad-degree').val()},function(result){
        console.log(result);
        // $('#post-graduation-school').val('');$('#post-grad-performance').val('');$('#post-grad-degree').val('');
    });
    $('#post-graduation-modal').modal('hide');
    $('#plus4').addClass('display');
    $('#check4').removeClass('display');
    $('#plus_check4').addClass('green');
});

$('#phd_details').submit(function(e){
    e.preventDefault();
    $.post('/phd_details',{college:$('#phd-school').val(),start:$('#phd-start-year').val(),end:$('#phd-end-year').val(),scale:$('#phd-scale').val(),performance:$('#phd-performance').val(),degree:$('#phd-degree').val()},function(result){
        console.log(result);
        // $('#phd-school').val('');$('#phd-performance').val('');$('#phd-degree').val('');
    });
    $('#phd-modal').modal('hide');
    $('#plus5').addClass('display');
    $('#check5').removeClass('display');
    $('#plus_check5').addClass('green');
});
