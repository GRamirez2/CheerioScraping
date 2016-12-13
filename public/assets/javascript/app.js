$.getJSON('/articles', function(data) {
  for (var i = 0; i<data.length; i++){
    $('#articles').append('<div class="imgBox" data-id="' + data[i]._id + '"><img class="img" src="http://www.ethertongallery.com/' + data[i].link + '">' + '<p class="titleText" data-id="' + data[i]._id + '">'+ data[i].title + '</p></div>');
  }
});



$(document).on('click', '.imgBox', function(){
  $('#notes').empty();
  $('#noteResults').empty();
  var thisId = $(this).attr('data-id');

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId,
  })
    .done(function( data ) {
      console.log(data);
      $('#notes').append('<h2>' + data.title + '</h2>');
      
      $('#notes').append('<textarea id="bodyinput" name="body"></textarea>');
      $('#noteResults').append('<div id="noteResults" name="notebody"></div>');
      $('#notes').append('<button data-id="' + data._id + '" id="savenote">Save Note</button>');

      if(data.note){
        // console.log("data.note.length = " + data.note.length);
        for (var i = 0; i < data.note.length; i++) {
          // console.log( data.note[i].body);

          $('#noteResults').prepend('<span class="dataTitle" data-id=' + data.note[i]._id + ' > '+data.note[i].body+' </span><span class="deleteNote" data-id=' + data.note[i]._id + ' photo-id=' + data._id + '> X </span><br>');

        }
      }
    });
});

// Click delete note

$(document).on('click', '.deleteNote', function(){
  var thisId = $(this).attr('data-id');
  var photoId = $(this).attr('photo-id');

  $.ajax({
    method: "DELETE",
    url: "/deletenote/" + thisId
  })
    .done(function() {
      $(this).remove();

      resetNotes(photoId);
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
      // console.log(data);
    //   $('#notes').empty();
    resetNotes(thisId);
    });
      // $('#titleinput').val("");
      // $('#bodyinput').val("");
    // });
    

});


function resetNotes(thisId){
  $('#notes').empty();
  $('#noteResults').empty();
  
  

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId,
  })
    .done(function( data ) {
      console.log( data );
      $('#notes').append('<h2>' + data.title + '</h2>');
      
      $('#notes').append('<textarea id="bodyinput" name="body"></textarea>');
      $('#noteResults').append('<div id="noteResults" name="notebody"></div>');
      $('#notes').append('<button data-id="' + data._id + '" id="savenote">Save Note</button>');

      if(data.note){
        // console.log("data.note.length = " + data.note.length);
        for (var i = 0; i < data.note.length; i++) {
          // console.log( data.note[i].body);

          $('#noteResults').prepend('<span class="dataTitle" data-id=' + data.note[i]._id + ' > '+data.note[i].body+' </span><span class="deleteNote" data-id=' + data.note[i]._id + '> X </span><br>');

        }
      }
    });
};