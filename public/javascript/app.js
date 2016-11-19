
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


 $('#piBTN').click(function(){
    piSubmit();
 });

 $('#psSubmitBTN').click(function(){
  psSubmit();
 });

 $('#expSubmitBTN').click(function(){
  expSubmit();
 });

 $('.editExpBTN').click(function(){
  var $text = $(this).parents('.theContent').find('.theId');

  var theExpData = {
    theID: $text.text()
  }

  $.ajax({
    type:'GET',
    url: '/cvs/' + $('#cvID').text() + '/exp/' + $text.text(),
    data: JSON.stringify(theExpData),
    contentType: 'application/json',
    dataType: 'json',
    success: function(data){
      $('#editingHeading').text('Editing ' + JSON.stringify(data.role));
      $('#expRole').val(data.role);
      $('#expCategory').val(data.category);
      $('#expCompanyDescription').val(data.companydescription);
      $('#expCompany').val(data.company);
      $('#expCity').val(data.city);
      $('#expCountry').val(data.country);
      $('#expStartDate').val(data.startmonth);
      $('#expStartYear').val(data.startyear);
      $('#expEndDate').val(data.endmonth);
      $('#expEndYear').val(data.endyear);
    },
    error: function(err){
      alert(err);
    }

  });
 });



//Personal info Function
function piSubmit(){

  var personalInfoData = {
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
    data: JSON.stringify(personalInfoData),
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


//Personal statement function
function psSubmit(){

  var personalStatementInfo = {
    thePersonalStatement: $('#PSInput').val()
  }

  $.ajax({
    type: 'POST',
    url: '/pssubmit/' + $('#cvID').text(),
    data: JSON.stringify(personalStatementInfo),
    contentType: 'application/json',
    dataType: 'json',
    success: function(data){
       
    },
    error: function(err){
      alert(err);
    }
  });
}


//Experience function

function expSubmit(){

  var experienceInfo = {
    theExpCategory: $('#expCategory').val(),
    theExpRole: $('#expRole').val(),
    theExpCompanyDescription: $('#expCompanyDescription').val(),
    theExpCompany: $('#expCompany').val(),
    theExpCity: $('#expCity').val(),
    theExpCountry: $('#expCountry').val(),
    theExpStartDate: $('#expStartDate').val(),
    theExpStartYear: $('#expStartYear').val(),
    theExpEndDate: $('#expEndDate').val(),
    theExpEndYear: $('#expEndYear').val()
  }

  $.ajax({
    type: 'POST',
    url: '/expsubmit/' + $('#cvID').text(),
    data: JSON.stringify(experienceInfo),
    contentType: 'application/json',
    dataType: 'json',
    success: function(data){
      alert(JSON.stringify(data));
    },
    error: function(err){
      alert(err);
    }
  });

}


