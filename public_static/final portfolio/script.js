/**
* Created by rohitkumar on 15/7/17.
*/

$(window).on('load', function(){
    setTimeout(removeLoader, 3000); //wait for page load PLUS two seconds.
});

function removeLoader(){
    $( "#loader" ).fadeOut(500, function() {
        // fadeOut complete. Remove the loading div
        $( "#loader" ).remove(); //makes page more lightweight
    });
}
//////years/////////////
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

var detail;
function training_delete(el) {
    $('#training'+el).hide("slow");
    $.post('/train_delete',{index:el},function(result){
        console.log(result);
    });
}

function intern_delete(el) {
    $('#intern'+el).hide("slow");
    $.post('/intern_delete',{index:el},function(result){
        console.log(result);
    });
}

function job_delete(el) {
    $('#job'+el).hide("slow");
    $.post('/job_delete',{index:el},function(result){
        console.log(result);
    });
}


$.post('/all',function(result){
    detail = result;
    $('.dropdown-menu').append('<li>&nbsp;Hi, '+result[0].personal.first_name+' '+result[0].personal.last_name+'</li>'+
        '<li class="divider"></li>'+
        '<li><a href="/logout">logout</a></li>'+
        '<li><a href="#">Help</a></li>'+
        '<li class="divider"></li>'+
        '<li><a href="#">About us</a></li>');
    $('#intro').html('<span ><img data-toggle="modal" data-target=".bs-example-modal-sm" src="/image.png" alt="" width="150px" class="profile-pic"></span>'+
        '<span class="name"><b>'+result[0].personal.first_name+' '+result[0].personal.last_name+'</b></span>'+
        '<span class="profession">UX/UI designer</span>');
    $('#profile').append('<ul id="profile_ul">'+
        '<li><h5 style="margin-bottom: 0"><b>Name</b></h5>'+result[0].personal.first_name+' '+result[0].personal.last_name+'</li>'+
        '<li><h5 style="margin-bottom: 0"><b>Date of Birth</b></h5>'+result[0].personal.dob+'</li>'+

        '<li><h5 style="margin-bottom: 0"><b>Phone</b></h5>+91- '+result[0].personal.phone+'</li>'+
        '<li><h5 style="margin-bottom: 0"><b>Email</b></h5><p>'+result[0].personal.email+'</p></li>'+
        '</ul>');

    $('#profile_ul').append('<li><h5 style="margin-bottom: 0"><b>Address</b></h5>'+result[0].address.address+'<br>'+result[0].address.city+
        '<br>'+result[0].address.state+' &nbsp;'+result[0].address.pincode+'</li>');

    if(result[0].education.sec.school !== "") {
        $('#education').append('<div class="secondary" id="secondary" style="margin-top: 30px">'+
            '<h4 class="education-heading" ><b>Secondary(X)</b>'+
             '<span class="delete"><i class="fa fa-trash-o" aria-hidden="true"></i></span>'+
            '<span class="edit" id="secondary_edit" onclick="secondary_edit()" data-toggle="modal" data-target="#secondary-modal" ><i class="fa fa-pencil" aria-hidden="true"></i></span>'+
            '</h4>'+
            '<div style="margin-left: 25px"><h5>'+result[0].education.sec.school+'</h5>'+
            '<h5>'+result[0].education.sec.board+'</h5>'+
            '<h5>performance: '+result[0].education.sec.performance+' '+result[0].education.sec.scale+'</h5>'+
            '<h5>Year of Completion: '+result[0].education.sec.compeletion+'</h5></div>'+
            '</div>');
    }

    if(result[0].education.sen_sec.school !== "") {
    $('#education').append('<div class="secondary" id="sen_secondary" style="margin-top:30px">'+
        '<h4 class="education-heading"><b>Senior Secondary(XII)</b>'+
        '<span class="delete"><i class="fa fa-trash-o" aria-hidden="true"></i></span>'+
        '<span class="edit" onclick="sen_secondary_edit()" data-toggle="modal" data-target="#sen-secondary-modal"><i class="fa fa-pencil" aria-hidden="true"></i></span>'+
        '</h4>'+
        '<div style="margin-left: 25px"><h5>'+result[0].education.sen_sec.school+'</h5>'+
        '<h5>'+result[0].education.sen_sec.board+'</h5>'+
        '<h5>performance: '+result[0].education.sen_sec.performance+' '+result[0].education.sen_sec.scale+'</h5>'+
        '<h5>Year of Completion: '+result[0].education.sen_sec.compeletion+'</h5></div>'+
        '</div>');
    }

    if(result[0].education.grad.school !== "") {
            $('#education').append('<div class="secondary" id="graduation">'+
                '<h4 class="education-heading" style="margin-top: 30px;"><b>Graduation</b>'+
                '<span class="delete"><i class="fa fa-trash-o" aria-hidden="true"></i></span>'+
                '<span class="edit" onclick="graduation_edit()" data-toggle="modal" data-target="#graduation-modal"><i class="fa fa-pencil" aria-hidden="true"></i></span>'+
                '</h4>'+
                '<div style="margin-left: 25px"><h5><b>'+result[0].education.grad.degree+' ('+result[0].education.grad.start+'-'+result[0].education.grad.end+')</b></h5>'+
                '<h5>'+result[0].education.grad.school+'</h5>'+
                '<h5>performance: '+result[0].education.grad.performance+'%</h5></div>'+
                '</div>');
    }

    if(result[0].education.post.school !== "") {
        $('#education').append('<div class="secondary" id="post-graduation" >'+
            '<h4 class="education-heading" style="margin-top: 30px;" ><b>Post-Graduation</b>'+
            '<span class="delete"><i class="fa fa-trash-o" aria-hidden="true"></i></span>'+
            '<span class="edit" onclick="post_graduation_edit()" data-toggle="modal" data-target="#post-graduation-modal"><i class="fa fa-pencil" aria-hidden="true"></i></span>'+
            '</h4>'+
            '<div style="margin-left: 25px"><h5><b>'+result[0].education.post.degree+' ('+result[0].education.post.start+'-'+result[0].education.post.end+')</b></h5>'+
            '<h5>'+result[0].education.post.school+'</h5>'+
            '<h5>performance: '+result[0].education.post.performance+'%</h5></div>'+
            '</div>');
    }

    if(result[0].education.phd.school !== "") {
        $('#education').append('<div class="secondary" id="phd">'+
            '<h4 class="education-heading" style="margin-top: 30px;" ><b>PhD</b>'+
            '<span class="delete"><i class="fa fa-trash-o" aria-hidden="true"></i></span>'+
            '<span class="edit" onclick="phd_edit()" data-toggle="modal" data-target="#phd-modal"><i class="fa fa-pencil" aria-hidden="true"></i></span>'+
            '</h4>'+
            '<div style="margin-left: 25px"><h5><b>'+result[0].education.phd.degree+' ('+result[0].education.phd.start+'-'+result[0].education.phd.end+')</b></h5>'+
            '<h5>'+result[0].education.phd.school+'</h5>'+
            '<h5>performance: '+result[0].education.phd.performance+' '+result[0].education.phd.scale+'</h5></div>'+
            '</div>');
    }

    $('#training').append('<h4 class="education-heading"><b>Training</b><span class="add"  onclick="add_training()" data-toggle="modal" data-target="#training-modal"><i class="fa fa-plus-square" aria-hidden="true"></i>'+
        '</span></h4>');
    if(result[0].experience.training.length !== 0){
        result[0].experience.training.forEach(function(x,i){
            if(x!== null){
                $('#training').append('<div class="training-content" id="training'+i+'">'+
                    '<h5><b>'+x.program+'</b>'+
                    '<span class="delete" onclick="training_delete('+i+')"><i class="fa fa-trash-o" aria-hidden="true"></i></span>'+
                    '<span class="edit" onclick="training_edit('+i+')" data-toggle="modal" data-target="#training-modal"><i class="fa fa-pencil" aria-hidden="true"></i></span>'+
                    '</h5>'+
                    '<h5>'+x.organization+' ('+x.start+'&nbsp;&nbsp;-&nbsp;&nbsp;'+x.end+')</h5>'+
                    '<h5>'+x.location+'</h5>'+
                    '<p>'+x.description+'</p>'+
                    '</div>');
            }

        });
    }

    $('#internship').append('<h4 class="education-heading"><b>Internship</b><span class="add"  onclick="add_intern()" data-toggle="modal" data-target="#internship-modal"><i class="fa fa-plus-square" aria-hidden="true"></i>'+
        '</span></h4>');
    if(result[0].experience.intern.length !== 0){
        result[0].experience.intern.forEach(function (x,i) {
            if(x!== null){
                $('#internship').append('<div class="training-content" id="intern'+i+'">' +
                    '<h5 class="intern-heading"><b>' + x.profile + '</b>'+
                    '<span class="delete" onclick="intern_delete('+i+')"><i class="fa fa-trash-o" aria-hidden="true"></i></span>'+
                    '<span class="edit" onclick="intern_edit('+i+')" data-toggle="modal" data-target="#internship-modal"><i class="fa fa-pencil" aria-hidden="true"></i></span>'+
                    '</h5>' +
                    '<h5>' + x.organization + ' (' + x.start + '&nbsp;&nbsp;-&nbsp;&nbsp;' + x.end + ')</h5>' +
                    '<h5>' + x.location + '</h5>' +
                    '<p>' + x.description + '</p>' +
                    '</div>');
            }
        });
    }

    $('#job').append('<h4 class="education-heading"><b>Job Details</b><span class="add"  onclick="add_job()" data-toggle="modal" data-target="#job-modal"><i class="fa fa-plus-square" aria-hidden="true"></i>'+
        '</span></h4>');
    if(result[0].experience.job.length !== 0){
        result[0].experience.job.forEach(function (x,i) {
            if(x!== null) {
                $('#job').append('<div class="training-content"id="job'+i+'">' +
                    '<h5><b>' + x.profile + '</b>'+
                    '<span class="delete" onclick="job_delete('+i+')"><i class="fa fa-trash-o" aria-hidden="true"></i></span>'+
                    '<span class="edit" onclick="job_edit('+i+')"  data-toggle="modal" data-target="#job-modal"><i class="fa fa-pencil" aria-hidden="true"></i></span>'+
                    '</h5>' +
                    '<h5>' + x.organization + ' (' + x.start + '&nbsp;&nbsp;-&nbsp;&nbsp;' + x.end + ')</h5>' +
                    '<h5>' + x.location + '</h5>' +
                    '<p>' + x.description + '</p>' +
                    '</div>');
            }
        });
    }

    if(result[0].experience.project.length !== 0) {
        $('#projects').append('<h2><b><i class="ion-ribbon-b"></i> Projects </b></h2>');
        result[0].experience.project.forEach(function(x){$('#projects').append('<div class="secondary" style="margin-top: 30px">'+
            '<h5><b>Project title: </b>'+x.title+'</h5>'+
            '<h5><b>Project link: </b><a href="'+x.projectlink+'">'+x.projectlink+'</a></h5>'+
            '<p>'+x.description+'</p>'+
            '</div>')});
    }

    if(result[0].skills.length !== 0) {
        result[0].skills.forEach(function(x){
            $('#skills-content').append('<div class="col-xs-6" style="padding: 0"><h5><b>'+x.skill+' ('+x.level+')</b></h5></div>');
        })
    }
});

$('#profile_edit').click(function(){
   $('#firstname').val(detail[0].personal.first_name);
   $('#lastname').val(detail[0].personal.last_name);
   $('#dob').val(detail[0].personal.dob);
   $('#email').val(detail[0].personal.email);
   $('#phone').val(detail[0].personal.phone);
});

$('#profile_details').submit(function (e){
    e.preventDefault();
    $('#profile').html('<h2><i class="fa fa-user"></i> <b>Profile</b>'+
        '<span id="profile_edit" class="profile_edit" data-toggle="modal" data-target="#profile-modal" ><i class="fa fa-pencil" aria-hidden="true"></i></span>'+
        '</h2>');
    $('#profile').append('<ul id="profile_ul">'+
    '<li><h5 style="margin-bottom: 0"><b>Name</b></h5>'+$('#firstname').val()+' '+$('#lastname').val()+'</li>'+
    '<li><h5 style="margin-bottom: 0"><b>Date of Birth</b></h5>'+$('#dob').val()+'</li>'+
    '<li><h5 style="margin-bottom: 0"><b>Phone</b></h5>+91- '+$('#phone').val()+'</li>'+
    '<li><h5 style="margin-bottom: 0"><b>Email</b></h5><p>'+$('#email').val()+'</p></li>'+
    '<li><h5 style="margin-bottom: 0"><b>Address</b></h5>'+detail[0].address.address+'<br>'+detail[0].address.city+
    '<br>'+detail[0].address.state+' &nbsp;'+detail[0].address.pincode+'</li>'+
    '</ul>');
    $.post('/personal_details_next',{firstname: $('#firstname').val(),lastname: $('#lastname').val(),dob:$('#dob').val(),email:$('#email').val(),phone:$('#phone').val()},function(result){
        console.log(result);});
    $('#profile-modal').modal('hide');

});

function secondary_edit() {
    console.log('inside function');
    $('#completion').val(detail[0].education.sec.compeletion);
    $('#board').val(detail[0].education.sec.board);
    $('#scale').val(detail[0].education.sec.scale);
    $('#performance').val(detail[0].education.sec.performance);
    $('#school').val(detail[0].education.sec.school);
}

function sen_secondary_edit() {
    console.log('inside function');
    $('#sen-completion').val(detail[0].education.sen_sec.compeletion);
    $('#sen-board').val(detail[0].education.sen_sec.board);
    $('#sen-scale').val(detail[0].education.sen_sec.scale);
    $('#sen-performance').val(detail[0].education.sen_sec.performance);
    $('#sen-school').val(detail[0].education.sen_sec.school);
}

function graduation_edit() {
    $('#graduation-school').val(detail[0].education.grad.school);
    $('#grad-degree').val(detail[0].education.grad.degree);
    $('#grad-start-year').val(detail[0].education.grad.start);
    $('#grad-end-year').val(detail[0].education.grad.end);
    $('#grad-scale').val(detail[0].education.grad.scale);
    $('#grad-performance').val(detail[0].education.grad.performance);
}

function post_graduation_edit() {
    $('#post-graduation-school').val(detail[0].education.post.school);
    $('#post-grad-degree').val(detail[0].education.post.degree);
    $('#post-grad-start-year').val(detail[0].education.post.start);
    $('#post-grad-end-year').val(detail[0].education.post.end);
    $('#post-grad-scale').val(detail[0].education.post.scale);
    $('#post-grad-performance').val(detail[0].education.post.performance);
}

function phd_edit() {
    $('#phd-school').val(detail[0].education.phd.school);
    $('#phd-degree').val(detail[0].education.phd.degree);
    $('#phd-start-year').val(detail[0].education.phd.start);
    $('#phd-end-year').val(detail[0].education.phd.end);
    $('#phd-scale').val(detail[0].education.phd.scale);
    $('#phd-performance').val(detail[0].education.phd.performance);
}


$('#secondary_details').submit(function(e){
   e.preventDefault();
    $('#secondary').html('<h4 class="education-heading"><b>Secondary(X)</b>'+
        '<span class="delete"><i class="fa fa-trash-o" aria-hidden="true"></i></span>'+
        '<span class="edit" data-toggle="modal" data-target="#secondary-modal" ><i class="fa fa-pencil" aria-hidden="true"></i></span>'+
        '</h4>'+
        '<div style="margin-left: 25px"><h5>'+$('#school').val()+'</h5>'+
        '<h5>'+$('#board').val()+'</h5>'+
        '<h5>performance: '+$('#performance').val()+' '+$('#scale').val()+'</h5>'+
        '<h5>Year of Completion: '+$('#completion').val()+'</h5></div>');
    $('#secondary-modal').modal('hide');
    $.post('/secondary_details',{completion:$('#completion').val(),board:$('#board').val(),scale:$('#scale').val(),performance:$('#performance').val(),school:$('#school').val()},function(result){
        console.log(result);
    });
});

$('#sen_secondary_details').submit(function(e){
    e.preventDefault();
    $('#sen_secondary').html('<h4 class="education-heading"><b>Senior Secondary(XII)</b>'+
        '<span class="delete"><i class="fa fa-trash-o" aria-hidden="true"></i></span>'+
        '<span class="edit" data-toggle="modal" data-target="#secondary-modal" ><i class="fa fa-pencil" aria-hidden="true"></i></span>'+
        '</h4>'+
        '<div style="margin-left: 25px"><h5>'+$('#sen-school').val()+'</h5>'+
        '<h5>'+$('#sen-board').val()+'</h5>'+
        '<h5>performance: '+$('#sen-performance').val()+' '+$('#sen-scale').val()+'</h5>'+
        '<h5>Year of Completion: '+$('#sen-completion').val()+'</h5></div>');
    $('#sen-secondary-modal').modal('hide');
    $.post('/sen_secondary_details',{completion:$('#sen-completion').val(),board:$('#sen-board').val(),scale:$('#sen-scale').val(),performance:$('#sen-performance').val(),school:$('#sen-school').val()},function(result){
        console.log(result);
        // $('#sen-board').val('');$('#sen-performance').val('');$('#sen-school').val('');
    });
});

$('#graduation_details').submit(function(e){
    e.preventDefault();
    $('#graduation').html('<h4 class="education-heading" style="margin-top: 30px;"><b>Graduation</b>'+
        '<span class="delete"><i class="fa fa-trash-o" aria-hidden="true"></i></span>'+
        '<span class="edit" onclick="graduation_edit()" data-toggle="modal" data-target="#graduation-modal"><i class="fa fa-pencil" aria-hidden="true"></i></span>'+
        '</h4>'+
        '<div style="margin-left: 25px"><h5><b>'+$('#grad-degree').val()+' ('+$('#grad-start-year').val()+'-'+$('#grad-end-year').val()+')</b></h5>'+
        '<h5>'+$('#graduation-school').val()+'</h5>'+
        '<h5>performance: '+$('#grad-performance').val()+' '+$('#grad-scale').val()+'</h5></div>');
    $.post('/graduation_details',{college:$('#graduation-school').val(),start:$('#grad-start-year').val(),end:$('#grad-end-year').val(),scale:$('#grad-scale').val(),performance:$('#grad-performance').val(),degree:$('#grad-degree').val()},function(result){
        console.log(result);
    });
    $('#graduation-modal').modal('hide');
});


$('#post_graduation_details').submit(function(e){
    e.preventDefault();
    $('#post-graduation').html('<h4 class="education-heading" style="margin-top: 30px;"><b>Post-Graduation</b>'+
        '<span class="delete"><i class="fa fa-trash-o" aria-hidden="true"></i></span>'+
        '<span class="edit" onclick="post_graduation_edit()" data-toggle="modal" data-target="#post-graduation-modal"><i class="fa fa-pencil" aria-hidden="true"></i></span>'+
        '</h4>'+
        '<div style="margin-left: 25px"><h5><b>'+$('#post-grad-degree').val()+' ('+$('#post-grad-start-year').val()+'-'+$('#post-grad-end-year').val()+')</b></h5>'+
        '<h5>'+$('#post-graduation-school').val()+'</h5>'+
        '<h5>performance: '+$('#post-grad-performance').val()+' '+$('#post-grad-scale').val()+'</h5></div>');
    $.post('/post_graduation_details',{college:$('#post-graduation-school').val(),start:$('#post-grad-start-year').val(),end:$('#post-grad-end-year').val(),scale:$('#post-grad-scale').val(),performance:$('#post-grad-performance').val(),degree:$('#post-grad-degree').val()},function(result){
        console.log(result);
    });
    $('#post-graduation-modal').modal('hide');
});

$('#phd_details').submit(function (e) {
    e.preventDefault();
    $('#phd').html('<h4 class="education-heading" style="margin-top: 30px;" ><b>PhD</b>'+
        '<span class="delete"><i class="fa fa-trash-o" aria-hidden="true"></i></span>'+
        '<span class="edit" onclick="phd_edit()" data-toggle="modal" data-target="#phd-modal"><i class="fa fa-pencil" aria-hidden="true"></i></span>'+
        '</h4>'+
        '<div style="margin-left: 25px"><h5><b>'+$('#phd-degree').val()+' ('+$('#phd-start-year').val()+'-'+$('#phd-end-year').val()+')</b></h5>'+
        '<h5>'+$('#phd-school').val()+'</h5>'+
        '<h5>performance: '+$('#phd-performance').val()+' '+$('#phd-scale').val()+'</h5></div>');
    $('#phd-modal').modal('hide');
    $.post('/phd_details',{college:$('#phd-school').val(),start:$('#phd-start-year').val(),end:$('#phd-end-year').val(),scale:$('#phd-scale').val(),performance:$('#phd-performance').val(),degree:$('#phd-degree').val()},function(result){
        console.log(result);
    });
});

function training_edit(el){
    $('#training-program').val(detail[0].experience.training[el].program);
    $('#training-start').val(detail[0].experience.training[el].start);
    $('#training-end').val(detail[0].experience.training[el].end);
    $('#training-organization').val(detail[0].experience.training[el].organization);
    $('#training-location').val(detail[0].experience.training[el].location);
    $('#training-description').val(detail[0].experience.training[el].description);

    $('#training_details').submit(function(e){
        e.preventDefault();
        // console.log('hello');
        // $('#training'+el).html('<h5><b>'+$('#training-program').val()+'</b>'+
        //     '<span class="delete" onclick="training_delete('+el+')"><i class="fa fa-trash-o" aria-hidden="true"></i></span>'+
        //     '<span class="edit" onclick="training_edit('+el+')" data-toggle="modal" data-target="#training-modal"><i class="fa fa-pencil" aria-hidden="true"></i></span>'+
        //     '</h5>'+
        //     '<h5>'+$('#training-organization').val()+' ('+$('#training-start').val()+'&nbsp;&nbsp;-&nbsp;&nbsp;'+$('#training-end').val()+')</h5>'+
        //     '<h5>'+$('#training-location').val()+'</h5>'+
        //     '<p>'+$('#training-description').val()+'</p>');
        $.post('/update_training_details',{el:el,program:$('#training-program').val(),organization:$('#training-organization').val(),location:$('#training-location').val(),start:$('#training-start').val(),end:$('#training-end').val(),description:$('#training-description').val()},function(result){
            console.log(result);
            window.location.href='/resume';
        });

    });
}

function intern_edit(el){
    $('#intern-profile').val(detail[0].experience.intern[el].profile);
    $('#intern-start').val(detail[0].experience.intern[el].start);
    $('#intern-end').val(detail[0].experience.intern[el].end);
    $('#intern-organization').val(detail[0].experience.intern[el].organization);
    $('#intern-location').val(detail[0].experience.intern[el].location);
    $('#intern-description').val(detail[0].experience.intern[el].description);

    $('#intern_details').submit(function(e){
        e.preventDefault();
        console.log(el);
        $.post('/update_intern_details',{el:el,program:$('#intern-profile').val(),organization:$('#intern-organization').val(),location:$('#intern-location').val(),start:$('#intern-start').val(),end:$('#intern-end').val(),description:$('#intern-description').val()},function(result){
            console.log(result);
            window.location.href='/resume';
        });
    });
}

function job_edit(el){
    $('#job-profile').val(detail[0].experience.job[el].profile);
    $('#job-start').val(detail[0].experience.job[el].start);
    $('#job-end').val(detail[0].experience.job[el].end);
    $('#job-organization').val(detail[0].experience.job[el].organization);
    $('#job-location').val(detail[0].experience.job[el].location);
    $('#job-description').val(detail[0].experience.job[el].description);

    $('#job_details').submit(function(e){
        e.preventDefault();
        console.log(el);
        $.post('/update_job_details',{el:el,program:$('#job-profile').val(),organization:$('#job-organization').val(),location:$('#job-location').val(),start:$('#job-start').val(),end:$('#job-end').val(),description:$('#job-description').val()},function(result){
            console.log(result);
            window.location.href='/resume';
        });
    });
}

function add_training () {
    $('#training_details').submit(function(e){
        e.preventDefault();
        $.post('/training_details',{program:$('#training-program').val(),organization:$('#training-organization').val(),location:$('#training-location').val(),start:$('#training-start').val(),end:$('#training-end').val(),description:$('#training-description').val()},function(result){
            console.log(result);
            window.location.href="/resume";
        });
        $('#training-modal').modal('hide');
    })
}

function add_intern(){
    $('#intern_details').submit(function(e){
        e.preventDefault();
        $.post('/intern_details',{profile:$('#intern-profile').val(),organization:$('#intern-organization').val(),location:$('#intern-location').val(),start:$('#intern-start').val(),end:$('#intern-end').val(),description:$('#intern-description').val()},function(result){
            console.log(result);
            window.location.href = '/resume';
        });
        $('#internship-modal').modal('hide');
    })
}

function add_job(){
    $('#job_details').submit(function(e){
        e.preventDefault();
        if($('#job-end').val() === '')
            var end = 'Currently working here';
        else {
            var end =$('#job-end').val();}
        $.post('/job_details',{profile:$('#job-profile').val(),organization:$('#job-organization').val(),location:$('#job-location').val(),start:$('#job-start').val(),end:end,description:$('#job-description').val()},function(result){
            console.log(result);
            window.location.href = '/resume';
        });
        $('#job-modal').modal('hide');
    })
}

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


