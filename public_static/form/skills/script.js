    /**
    * Created by rohitkumar on 13/7/17.
    */
    $(function(){
        $('#add-skill').click(function(){
            if($('#skill-input').val()) {
                $('#skill-level').fadeIn("slow");
            }
        });

        $('#close').click(function(){
            $('#skill-level').fadeOut();
            $('#skill-input').val('');
        });

        function clear(level) {
            $('#skill-level').fadeOut();
            $.post('/skill_details',{skill:$('#skill-input').val(),skill_level:level},function(result){
                console.log(result);
            });
            $('#div').append('<div><h4><b>'+$('#skill-input').val()+'</b></h4><span>'+level+'</span></div>');
            $('#skill-input').val('');
        }

        $('#beginner').click(function(){
            clear('Beginner');
        });

        $('#intermediate').click(function(){
            clear('Intermediate');
        });

        $('#advanced').click(function(){
            clear('Advanced');
        })
    });

    $('#next').click(function(){
        window.location.href = "/resume";
    });

