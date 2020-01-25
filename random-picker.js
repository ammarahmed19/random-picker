$(document).ready(function(){
    var maxField = 50; //Input fields increment limitation
    var addButton = $('.add_button'); //Add button selector
    var wrapper = $('.field_wrapper'); //Input field wrapper
    var fieldHTML = '<div><input type="text" name="field_name[]" value=""/><a href="javascript:void(0);" class="remove_button"><img src="ico/minus.png" width="16px"/></a></div>'; //New input field html 
    var x = 1; //Initial field counter is 1

    //shuffle algorithm
    function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }
    
    //Once add button is clicked
    $(addButton).click(function(){
        //Check maximum number of input fields
        if(x < maxField){ 
            x++; //Increment field counter
            $(wrapper).append(fieldHTML); //Add field html
        }
    });
    
    //Once remove button is clicked
    $(wrapper).on('click', '.remove_button', function(e){
        e.preventDefault();
        $(this).parent('div').remove(); //Remove field html
        x--; //Decrement field counter
    });

    //When submit is clicked
    $("#submit").click(function () {
        if (!$("input[name='gap']").val() || $("input[name='gap']").val() === "" || isNaN(parseFloat($("input[name='gap']").val())) && isFinite($("input[name='gap']").val()))
        {
            $('#err').replaceWith("<span id='err' style='color:red'><b>Please enter the gap amount</b></span><br>");
            alert("Please fill in the required fields");
            return 0;
        }
        if (!$("input[name='size']").val() || $("input[name='size']").val() === "" || isNaN(parseFloat($("input[name='size']").val())) && isFinite($("input[name='gap']").val()))
        {
            $('#err2').replaceWith("<span id='err' style='color:red'><b>Please enter the group size</b></span><br>");
            alert("Please fill in the required fields");
            return 0;
        }
        $(".meets").replaceWith("<table class='meets'><tr><th>Names</th><th>Time</th></tr></table>");
        var _start = $("input[name='start']").val().split(/\:|\-/g);
        var gap = parseInt($("input[name='gap']").val());
        var size = parseInt($("input[name='size']").val());
        var names = [];
        $('.field_wrapper div').each(function(field) {
            names.push($('input', this).val());
        });
        names = shuffle(names);
        var _time = new Date;
        _time.setHours(_start[0]);
        _time.setMinutes(_start[1]);
        var time = _time.getMinutes > 9 ? `${_time.getHours()}:${_time.getMinutes()}` : `${_time.getHours()}:0${_time.getMinutes()}`;
        for (var i=0 ; i<names.length; i+=size) {
            if (names.length % size == 0)
                {$('.meets').append(`<tr><td>${Array.prototype.slice.call(names,i,i+size).join(' - ')}</td><td>${time}</td></tr>`);}
            else {
                if (i != names.length - 1)
                    {$('.meets').append(`<tr><td>${Array.prototype.slice.call(names,i,i+size).join(' - ')}</td><td>${time}</td></tr>`);}
                else
                    {$('.meets').append(`<tr><td>${names[i]}</td><td>${time}</td></tr>`);}
            }
            _time.setMinutes(_time.getMinutes() + gap);
            time = _time.getMinutes() > 9 ? `${_time.getHours()}:${_time.getMinutes()}` : `${_time.getHours()}:0${_time.getMinutes()}`;
        }
        $("#download").replaceWith('<button class="btn btn-success" id="download">Download Table</button>');
    });

    // When download is pressed
    $(document).on('click', '#download', function() {
        var csv = [];
        var rows = document.querySelectorAll("table tr");
        var filename = "table.csv";
        
        for (var i = 0; i < rows.length; i++) {
            var row = [], cols = rows[i].querySelectorAll("td, th");
            
            for (var j = 0; j < cols.length; j++) 
                row.push(cols[j].innerText);
            
            csv.push(row.join(","));        
        }
        // Download CSV file
        var csvFile = new Blob([csv.join('\n')], {type: "text/csv"});
        // Download link
        downloadLink = document.createElement("a");

        // File name
        downloadLink.download = filename;

        // We have to create a link to the file
        downloadLink.href = window.URL.createObjectURL(csvFile);

        // Make sure that the link is not displayed
        downloadLink.style.display = "none";

        // Add the link to your DOM
        document.body.appendChild(downloadLink);

        // Lanzamos
        downloadLink.click();
        });
});