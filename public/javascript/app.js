
  function checkPass(){ 
  var pass1 = document.getElementById('pass1');
  var pass2 = document.getElementById('pass2');
  var message = document.getElementById('confirmMessage');
  var btn = document.querySelector('#buttonSubmit');

    if(pass1.value == pass2.value){
      btn.disabled = false;
      pass2.style.backgroundColor = "#66cc66";
      message.style.color = "#66cc66";
      message.innerHTML = "Confirm password Matched!"
    }else{
      btn.disabled = true;
      pass2.style.backgroundColor = "#ff6666";
      message.style.color = "#ff6666";
      message.innerHTML = "Confirm password doesn't match!"
     }
} 


function addmore() {
    var newdiv = document.createElement('div');
    newdiv.className = 'form-group form-inline';
    newdiv.innerHTML = 
    '<input type="text" class="form-control skillsInput" name="cv[skills]" placeholder="Skills"><button type="button" class="btn btn-danger btnremove">-</button>';
    document.getElementById('skillsField').appendChild(newdiv);
    removeThis();
}

function myFunction(id) {
    var x = document.getElementById(id);
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else { 
        x.className = x.className.replace(" w3-show", "");
    }
}

  function openScreen(evt, screenName) {
    var i, x, tablinks;
    x = document.getElementsByClassName("screen");
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < x.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" w3-orange", "");
    }

  }
openScreen(event, 'SCEditCV ');


var removeThis = function(){
  $('.btnremove').on('click', function(){
    $(this).parent('div').remove();
  }); 
}



 $('.btnremove').on('click', function(){
    $(this).parent('div').remove();
  }); 

//  $('#newcvBTN').click(function(){
//     newCV();
//  });

//  $('#checkIdBTN').click(function(){
//   alert(CVID);
//  });

 $('#piBTN').click(function(){
    piSubmit();
 });

 $('#psSubmitBTN').click(function(){
  alert('hey');
 });

// var CVID = '';

// function newCV(){

//   var createCV = {
//     createdCV: $('#newcvInput').val()
//   }

//   $.ajax({
//     type: 'POST',
//     url: '/newcv',
//     data: JSON.stringify(createCV),
//     contentType: 'application/json',
//     dataType: 'json',
//     success: function(data){
//       CVID = JSON.stringify(data._id);
//     },
//     error: function(err){
//       alert(err);
//     }
//   });
// }

function piSubmit(){


  var piData = {
    theFN: $('#fnPI').val(),
    theLN: $('#lnPI').val(),
    theAddress: $('#addressPI').val(),
    theSuburb: $('#suburbPI').val(),
    theCity: $('#cityPI').val(),
    thePostcode: $('#postcodePI').val(),
    theMobilephone: $('#mobilephonePI').val(),
    theEmail: $('#emailPI').val()
  }

  $.ajax({
    type: 'POST',
    url: '/pisubmit/' + $('#cvID').text(),
    data: JSON.stringify(piData),
    contentType: 'application/json',
    dataType: 'json',
    success: function(data){
      $('#MessHere').append(JSON.stringify(data));
    },
    error: function(err){
      alert(err);
    }
  });

}



