$(function() {

	// DOM is loaded, let's run the code
    console.log('ready!');

    // when hovered over the grid, change it to black, when hovered out,
    // change it back to grey
    $('#t_grid').hover(function(){
    	$('#t_grid div').css('background-color', 'black');
    }, function(){
    	$('#t_grid div').css('background-color', '#696969');
	});

    // when hovered over the search box, change it's border, and when
    // hovered out, change it back to default - but only if input is not focused
    $('#search_box').hover(function(){
    	if ($('#search_box input').is(':focus') == false) {
    		$('#search_box').css({'border' : '1px solid #bdbdbd', 'border-top' : '1px solid #a8a8a8'});
    	}
    }, function(){
    	if ($('#search_box input').is(':focus') == false) {
    		$('#search_box').css('border', '1px solid lightgray');
    	}
	});

    // focus onto the search input when the entire div
    // is clicked
	$('#search_box').click(function() {
		console.log('search box clicked')
	    $('#search_box input').focus()
	});

	// change the search box border when it's focused
	$('#search_box input').focus(function() {
	    $('#search_box').css('border','1px solid #9999ff');
	}).blur(function() {
	    $('#search_box').css('border','1px solid lightgray'); // setting it back to the default
	});

    // reveal the tooltip on mic image hover
    $('#search_box form img').hover(function() {
        console.log('mic hover');
        // show the tooltip after 150ms of hover
        setTimeout(function() {
            console.log('setTimeout function');
            $('#tooltip').css('visibility', 'visible');
        },150);
    }, function() {
        console.log('mic hover out');
        // hide the tooltip after 150ms of hover
        setTimeout(function() {
            console.log('setTimeout function');
            $('#tooltip').css('visibility', 'hidden');
        },150);
    });

    // open up the search by voice div on mic click
    $('#search_box form img').click(function() {
        console.log('mic click');
        $('html').append('<div id="voice_div"></div>');
    });
    // close the search by voice div when clicking on it
    $('html').on('click', '#voice_div', function() {
        console.log('div click');
        $(this).remove('#voice_div');
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
            // change the width of the button to fit the currently selected word
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
            $('#search_btns button:nth-child(2) ul').css('bottom', '-135px'); // this is the original position
            $('#search_btns button:nth-child(2)').css('width', '144px'); // reset the original width of the button
        },200);
    });

});