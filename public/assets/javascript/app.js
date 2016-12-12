$.getJSON('/articles', function(data) {
  for (var i = 0; i<data.length; i++){
    $('#articles').append('<img src="http://www.ethertongallery.com/' + data[i].link + '">' + '<p data-id="' + data[i]._id + '">'+ data[i].title + '</p><br />');
  }
});



$(document).on('click', 'p', function(){
  $('#notes').empty();
  $('#allNotes').empty();
  var thisId = $(this).attr('data-id');

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId,
  })
    .done(function( data ) {
      // console.log(data);
      $('#notes').append('<h2>' + data.title + '</h2>');
      
      $('#notes').append('<textarea id="bodyinput" name="body"></textarea>');
      $('#allNotes').append('<textarea id="noteResults" name="notebody"></textarea>');
      $('#notes').append('<button data-id="' + data._id + '" id="savenote">Save Note</button>');

      if(data.note){
        console.log("data.note.length = " + data.note.length);
        for (var i = 0; i < data.note.length; i++) {
          console.log( data.note[0].body );
          $("#noteResults").prepend("<p class='dataentry' data-id=" + data.note[i]._id + "><span class='dataTitle' data-id=" +
          data.note[i]._id + ">" + data.note[i].title + "</span><span class=deleter>X</span></p>");
          // $('#bodyinput').val(data.note.body);
        }
      }
    });
});

// Click delete note

$(document).on('click', '#deletenote', function(){
  var thisId = $(this).attr('data-id');
  console.log(thisId);

  $.ajax({
    method: "POST",
    url: "/deletenote/" + thisId
  })
    .done(function() {
 
      $('#titleinput').val("");
      $('#bodyinput').val("");
    });
});

$(document).on('click', '#savenote', function(){
  var thisId = $(this).attr('data-id');
  console.log(thisId);

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      body: $('#bodyinput').val()
    }
  })
    .done(function( data ) {
      console.log(data);
    //   $('#notes').empty();
    });
      // $('#titleinput').val("");
      $('#bodyinput').val("");
    // });

});