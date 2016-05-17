$(function() {

	// DOM is loaded, let's run the code.
    console.log('ready!');

    // When hovered over the grid, change it to black, when hovered out,
    // change it back to grey.
    $('#t_grid').hover(function(){
    	$('#t_grid div').css('background-color', 'black');
    }, function(){
    	$('#t_grid div').css('background-color', '#696969');
	});

    // When hovered over the search box, change it's border, and when
    // hovered out, change it back to default - but only if input is not focused.
    $('#search_box').hover(function(){
    	if ($('#search_box input').is(':focus') == false) {
    		$('#search_box').css({'border' : '1px solid #bdbdbd', 'border-top' : '1px solid #a8a8a8'});
    	}
    }, function(){
    	if ($('#search_box input').is(':focus') == false) {
    		$('#search_box').css('border', '1px solid lightgray');
    	}
	});

    // Focus onto the search input when the entire div
    // is clicked.
	$('#search_box').click(function() {
		console.log('search box clicked')
	    $('#search_box input').focus()
	});

	// Change the search box border when it's focused.
	$('#search_box input').focus(function() {
	    $('#search_box').css('border','1px solid #9999ff');
	}).blur(function() {
	    $('#search_box').css('border','1px solid lightgray'); // setting it back to the default
	});

    // Reveal the tooltip on mic image hover.
    $('#search_box form img').hover(function() {
        console.log('mic hover');
        // Show the tooltip after 150ms of hover.
        setTimeout(function() {
            console.log('setTimeout function');
            $('#tooltip').css('visibility', 'visible');
        },150);
    }, function() {
        console.log('mic hover out');
        // Hide the tooltip after 150ms of hover.
        setTimeout(function() {
            console.log('setTimeout function');
            $('#tooltip').css('visibility', 'hidden');
        },150);
    });

    // Open up (un-hide) the search by voice div on mic click.
    $('#search_box form img').click(function() {
        console.log('mic click');
        $('#voice_div').css('display', 'initial');
        // Also run the speech reconigiont function (see below).
        speech_func();
    });
    // Close the search by voice div (hide it) when clicking on it.
    $('html').on('click', '#voice_div', function() {
        console.log('div click');
        $(this).css('display', 'none');
        $('#voice_input_div form input').val(''); // Empty the input field.
    });

    // The button spin animation.
    $('#search_btns button:nth-child(2)').hover(function() {
        console.log('begin random spin');
        // Randomly generate one out of the 11 positions of the words in our spin animation.
        // This math function randomly picks a number between 1 and 11, and then uses this formula:
        // (5n-3)5 to convert it to one of the positions of a word (which is either -10, -35, -60,
        // -85, ... -260).
        // The code runs after 150ms delay as per the setTimeout function.

        // We give an ID (i.e. variable) for the timeout function, so we can reference it and have it cancelled if we
        // hover out of the button before the timer ends. If you're in a function then 'var' will create a local variable,
        // "no var" will look up the scope chain until it finds the variable or hits the global scope (at which point it will create it).
        // Therefore, it's important that we don't put 'var' infront of our btnTimeID, so that we can reference it (and cancel it) in the
        // hover out function.
        btnTimeID = setTimeout(function() {
            console.log('setTimeout function');
            var pos = -((Math.floor((Math.random() * 11) + 1)) * 5 - 3) * 5
            if (pos === -135) {
                console.log("position didn't change, let's force change")
                pos = -35;
            }
            console.log(pos);
            $('#search_btns button:nth-child(2) ul').animate({'bottom':pos + 'px'}, 300);
            // Change the width of the button to fit the currently selected word.
            if (pos === -35 || pos === -110 || pos === -185 || pos === -10 || pos === -60 || pos === -160) {
                console.log(pos + ' = -35, -110, -185, -10, -60, -160');
                $('#search_btns button:nth-child(2)').css('width', '149px');
            } else if (pos === -85) {
                console.log(pos + ' = -85');
                $('#search_btns button:nth-child(2)').css('width', '160px');
            } else if (pos === -210) {
                console.log(pos + ' = -210');
                $('#search_btns button:nth-child(2)').css('width', '165px');
            } else {
               console.log(pos + ' = -260, -235');
               $('#search_btns button:nth-child(2)').css('width', '144px'); 
            }
        },200);
    }, function() {
        clearTimeout(btnTimeID);
        console.log('reset spin');
        setTimeout(function() {
            console.log('setTimeout function');
            $('#search_btns button:nth-child(2) ul').css('bottom', '-135px'); // This is the original position.
            $('#search_btns button:nth-child(2)').css('width', '144px'); // Reset the original width of the button.
        },200);
    });

    // Sending the input of the Google search field to the real Google home page for a query.
    $('#search_btns button:nth-child(1)').click(function(){
        location = 'http://www.google.com/search?q=' + encodeURIComponent($('#search_box form input').val());
    });
    // Or if the 'enter' button is pressed within the search box, do the same thing as above.
    $(document).keypress(function(event){
        // The question mark here(below) is a a ternary if operation, simply put, it is a short, inline if statement.
        // If the statement before the question mark evaluates to true, then the left-hand side of the colon
        // is used, otherwise (if it is false) the right-hand side is used. 
        // In Firefox, you have to use event.which to get the keycode; while IE support both event.keyCode and event.which.
        var keycode = (event.keyCode ? event.keyCode : event.which); // Assign 'keycode' the value of the currently pressed keyboard button
        if(keycode == '13'){
            // A keycode of 13 corresopnd to the 'enter' button.
            //alert('You pressed a "enter" key in textbox');
            event.preventDefault(); // Prevents the default behaviour when you press enter in the input field (which just clears it and doesn't re-direct you).
            location = 'http://www.google.com/search?q=' + encodeURIComponent($('#search_box form input').val());  
        }
    });
    // if(event.keyCode == 13)
    // {
    //     location = 'http://www.google.com/search?q=' + encodeURIComponent($('#search_box form input').val());
    // }

    // Speech recognition, on click of the mic button.
    function speech_func() {
        console.log("start speech capture");

        // The below code will request permission from user to allow taking input through microphone access and then
        // will capture the sound you talk, send it to external service for recognition, and get the result back
        // inside ‘onresult’ event handler.
        var recognizer = new webkitSpeechRecognition();
        recognizer.lang = "en";
        recognizer.onresult = function(event) {
            if (event.results.length > 0) {
                var result = event.results[event.results.length-1];
                if(result.isFinal) {
                    $('#voice_input_div form input').val(result[0].transcript); // Take the caputured voice/text and insert it into the input field.
                    location = 'http://www.google.com/search?q=' + encodeURIComponent(result[0].transcript);
                }
            }  
        };

        recognizer.start(); // Start catpuring voice input.
    }
});