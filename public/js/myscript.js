var p1, p2, p3;
p1 = p2 = p3 = 0;

$(window).load(function() { 
  $("#spinner").fadeOut("slow"); 
});
 

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}


$(document).ready(function(){
    $.post("/mainPageData",
    {
      email : readCookie('usr_mail')
    },
  function( data , status){
    $('.name').html('Hi, ' + data.fname + '!');
  });
});

$(document).ready(function(){
    $(".icon").click(function(){
        var y = $(this).attr('data-tab');
        switch(parseInt(y, 10)){
          case 1: p1 = 1;
                  $(".i1").addClass('icon-clicked');
                  $(".account").load("account.html");
                  $(".prg1").fadeToggle(10);
                  break;
          case 2: p2 = 1;
                  $(".i2").addClass('icon-clicked');
                  $(".goldmine").load("upload.html");
                  $(".prg2").fadeToggle(10);
                  break;
          case 3: p3 = 1;
                  $(".i3").addClass('icon-clicked');
                  $(".prg3").fadeToggle(10);
                  break;
        }
    });

    $(".close").click(function(){
        var x = $(this).attr('data-tab');
        switch(parseInt(x, 10)){
          case 1: p1 = 0;
                  $(".i1").removeClass('icon-clicked');
                  $(".prg1").fadeOut(10);
                  break;
          case 2: p2 = 0;
                  $(".i2").removeClass('icon-clicked');
                  $(".prg2").fadeOut(10);
                  break;
          case 3: p3 = 0;
                  $(".i3").removeClass('icon-clicked');
                  $(".prg3").fadeOut(10);
                  break;
          default: alert('default case');
                  break;
        };
    });

});

function logout(){
  $.ajax( {
      method: "POST",
      url: "/logout",
  } )
  .done(function() {
    window.location.href = "http://krsna72.localtunnel.me/auth.html";
  })
  .fail(function(err) {
});
}


//===================   move program script   ===========================================

var mydragg = function(){
    return {
        move : function(divid,xpos,ypos){
            divid.style.left = xpos + 'px';
            divid.style.top = ypos + 'px';
        },
        startMoving : function(divid,main_wrapper,evt){
            evt = evt || window.event;
            var posX = evt.clientX,
                posY = evt.clientY,
                eWi = parseInt(getComputedStyle(divid).width),
                eHe = parseInt(getComputedStyle(divid).height),
                cWi = parseInt(getComputedStyle(document.getElementById('main_wrapper')).width),
                cHe = parseInt(getComputedStyle(document.getElementById('main_wrapper')).height);

              if (divid.style.top) {
                var divTop = divid.style.top;
              }else {
                var divTop = getComputedStyle(divid).top;
              }
              if (divid.style.left) {
                var divLeft = divid.style.left;
              }else {
                var divLeft = getComputedStyle(divid).left;
              }
                divTop = divTop.replace('px','');
                divLeft = divLeft.replace('px','');

            var diffX = posX - divLeft,
                diffY = posY - divTop;
            document.onmousemove = function(evt){
                  evt = evt || window.event;
                  var posX = evt.clientX,
                      posY = evt.clientY,
                      aX = posX - diffX,
                      aY = posY - diffY;
                  if (aX < 0) {aX = 0; document.onmousemove = function(){}; }
                  if (aY < 0) {aY = 0; document.onmousemove = function(){}; }   // maximize on top hit function can be written here.
                  if (aX + eWi > cWi) { aX = cWi - eWi; document.onmousemove = function(){}; }
                  if (aY + eHe > cHe) { aY = cHe -eHe; document.onmousemove = function(){}; }
                  mydragg.move(divid,aX,aY);
            }
        },
        stopMoving : function(){
            document.onmousemove = function(){}
        },
    }
}();

//======================= move program script end!  =========================================


//======================= brightness function =================================================

function getImageLightness(imageSrc,callback) {
    var img = document.createElement("img");
    img.src = imageSrc;
    img.style.display = "none";
    document.body.appendChild(img);

    var colorSum = 0;

    img.onload = function() {
        // create canvas
        var canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(this,0,0);

        var imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
        var data = imageData.data;
        var r,g,b,avg;

        for(var x = 0, len = data.length; x < len; x+=4) {
            r = data[x];
            g = data[x+1];
            b = data[x+2];
            avg = Math.floor((r+g+b)/3);
            colorSum += avg;
        }

        var brightness = Math.floor(colorSum / (this.width*this.height));
        callback(brightness);
    }
}

//============================================================================================
