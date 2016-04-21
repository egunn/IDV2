//from http://www.formget.com/how-to-create-pop-up-contact-form-using-javascript/

/*
// Validating Empty Field
function check_empty() {
    if (document.getElementById('popupUser1').value == "" || document.getElementById('popupUser2').value == "" ||       
        document.getElementById('popupUser3').value == "") {
        
        alert("Please enter 3 users to compare");
    } 
    else {
    document.getElementById('form').submit();
        console.log('here');
        var temp = document.getElementById('popupUser1').value;
        console.log(temp);
        
    }
}*/

//Function To Display Popup
function div_show() {
    //supposed to put popup on top. Doesn't seem to do anything....
    //document.getElementById('popupWindowDiv').focus();
}

//Function to Hide Popup
function div_hide(){
    console.log('div_hide')
    //inputName1 = document.getElementById("#popUser1").value;
    //test = 52;
    //console.log(test);
    document.getElementById('popupWindowDiv').style.display = "none";
    
    //reset entry fields as blank
    document.getElementById('popupUser1').value = "";
    document.getElementById('popupUser2').value = "";
    document.getElementById('popupUser3').value = "";
    
    return false;
}

//load popup for multiUser input
function popupPressed(){
    
    //window.location = "../popupform.html";
    
}