$('#training').submit(function(e){
    e.preventDefault();
    $.post('/training_details',{program:$('#training-program').val(),organization:$('#training-organization').val(),location:$('#training-location').val(),start:$('#training-start').val(),end:$('#training-end').val(),description:$('#training-description').val()},function(result){
        console.log(result);
        $('#training-program').val(''); $('#training-organization').val(''); $('#training-location').val(''); $('#training-start').val(''); $('#training-end').val(''); $('#training-description').val('');
        alert('Your data has been saved successfully.');
    });
    $('#training-modal').modal('hide');
});


$('#intern').submit(function(e){
    e.preventDefault();

    $.post('/intern_details',{profile:$('#intern-profile').val(),organization:$('#intern-organization').val(),location:$('#intern-location').val(),start:$('#intern-start').val(),end:$('#intern-end').val(),description:$('#intern-description').val()},function(result){
        console.log(result);
        $('#intern-profile').val(''); $('#intern-organization').val(''); $('#intern-location').val(''); $('#intern-start').val(''); $('#intern-end').val(''); $('#intern-description').val('');
        alert('Your data has been saved successfully.');
    });
    $('#internship-modal').modal('hide');

});


$('#job').submit(function(e){
    e.preventDefault();
    if($('#job-end').val() === '')
        var end = 'Currently working here';
    else {
        var end =$('#job-end').val();}
    $.post('/job_details',{profile:$('#job-profile').val(),organization:$('#job-organization').val(),location:$('#job-location').val(),start:$('#job-start').val(),end:end,description:$('#job-description').val()},function(result){
        console.log(result);
        $('#job-profile').val('');$('#job-organization').val('');$('#job-location').val('');$('#job-start').val('');$('#job-end').val('');$('#job-description').val('');
        alert('Your data has been saved successfully.');
    });
    $('#job-modal').modal('hide');
});


$('#project').submit(function(e){
    e.preventDefault();
    $.post('/project_details',{title:$('#project-title').val(),projectlink:$('#project-link').val(),description:$('#project-description').val()},function(result){
        console.log(result);
        $('#project-title').val('');$('#project-link').val('');$('#project-description').val('');
        alert('Your data has been successfully saved.');
    });
    $('#project-modal').modal('hide');
});

$('#current-date').click(function(){
    if(this.checked) {
        $('#job-end').attr('disabled', 'disabled');
        $('#job-end').css({
            'opacity': .5
        });
    }
    else {
        $('#job-end').removeAttr('disabled');
        $('#job-end').css({
            'opacity': 1
    });
    }
})