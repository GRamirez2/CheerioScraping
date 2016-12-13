$.getJSON('/articles', function(data) {
  for (var i = 0; i<data.length; i++){
    $('#articles').append('<div class="imgBox" data-id="' + data[i]._id + '"><img class="img" src="http://www.ethertongallery.com/' + data[i].link + '">' + '<p class="titleText" data-id="' + data[i]._id + '">'+ data[i].title + '</p></div>');
  }
});



$(document).on('click', '.imgBox', function(){
  $('#notes').empty();
  $('#noteResults').empty();
  var thisId = $(this).attr('data-id');
  modal.style.display = "block";

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId,
  })
    .done(function( data ) {
      console.log(data);
      //print title on side bar
      $('#notes').append('<h2>' + data.title + '</h2>');
      //print on modal header
      $('.modal-header').append('<span class="close">&times;</span><h2>' + data.title + '</h2><hr>');
      //print on side bar
      $('#notes').append('<textarea id="bodyinputX" name="body"></textarea>');
      $('#noteResults').append('<div id="noteResults" name="notebody"></div>');
      $('#notes').append('<button data-id="' + data._id + '" id="savenote">Save Note</button>');
      //print on modal footer
      $('.modal-footer').append('<hr><textarea id="bodyinput" name="body"></textarea>');
      $('.modal-footer').append('<button data-id="' + data._id + '" id="savenote">Save Note</button>');
      //create div for comments in modal body
      // $('.modal-body').append('<div id="noteResults" name="notebody"></div>');

      if(data.note){
        // console.log("data.note.length = " + data.note.length);
        for (var i = 0; i < data.note.length; i++) {
          // console.log( data.note[i].body);

          $('#noteResults').prepend('<span class="dataTitle" data-id=' + data.note[i]._id + ' > '+data.note[i].body+' </span><span class="deleteNote" data-id=' + data.note[i]._id + ' photo-id=' + data._id + '> X </span><br>');
          
          //print on comments on footer
          $('.modal-body').prepend('<span class="dataTitle" data-id=' + data.note[i]._id + ' > '+data.note[i].body+' </span><span class="deleteNote" data-id=' + data.note[i]._id + ' photo-id=' + data._id + '> X </span><br>');

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
      // $(this).remove();
      resetNotes(photoId);
    });
    
});

$(document).on('click', '#savenote', function(){
  var thisId = $(this).attr('data-id');
  // console.log(thisId);

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
      // $('.modal-header').empty();
      // $('.modal-footer').empty();
      // $('.modal-body').empty();
      // modal.style.display = "none";
    

});


function resetNotes(placeHolder){
  $('#notes').empty();
  $('#noteResults').empty();
  $('.modal-header').empty();
  $('.modal-body').empty();
  $('.modal-footer').empty();

  var thisId = placeHolder;
  

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId,
  })
    .done(function( data ) {
      console.log( data );
      $('#notes').append('<h2>' + data.title + '</h2>');
      //print on modal header
      $('.modal-header').append('<span class="close">&times;</span><h2>' + data.title + '</h2><hr>');
      
      $('#notes').append('<textarea id="bodyinputX" name="body"></textarea>');
      $('#noteResults').append('<div id="noteResults" name="notebody"></div>');
      $('#notes').append('<button data-id="' + data._id + '" id="savenote">Save Note</button>');

      //print on modal footer
      $('.modal-footer').append('<hr><textarea id="bodyinput" name="body"></textarea>');
      $('.modal-footer').append('<button data-id="' + data._id + '" id="savenote">Save Note</button>');

      if(data.note){
        // console.log("data.note.length = " + data.note.length);
        for (var i = 0; i < data.note.length; i++) {
          // console.log( data.note[i].body);

          //don't need to refresh this list anymore
          // $('#noteResults').prepend('<span class="dataTitle" data-id=' + data.note[i]._id + ' > '+data.note[i].body+' </span><span class="deleteNote" data-id=' + data.note[i]._id + '> X </span><br>');

          $('.modal-body').prepend('<span class="dataTitle" data-id=' + data.note[i]._id + ' > '+data.note[i].body+' </span><span class="deleteNote" data-id=' + data.note[i]._id + ' photo-id=' + data._id + '> X </span><br>');

        }
      }
    });
};

// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
// var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
// btn.onclick = function() {
//     modal.style.display = "block";
// }

// When the user clicks on <span> (x), close the modal
$(document).on('click', '.close', function(){

  $('.modal-header').empty();
  $('.modal-footer').empty();
  $('.modal-body').empty();
    modal.style.display = "none";
    
    
});

// When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//   $('.modal-header').empty();
//   $('.modal-footer').empty();
//   $('.modal-body').empty();
//     if (event.target == modal) {
//         modal.style.display = "none";
//     }
// }