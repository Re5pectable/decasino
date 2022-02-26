var isConnected = false;
var loginWindow = $('.modal-window-content.login')
var regWindow = $('.modal-window-content.reg')
var welcomeWrapper = $(".welcome-wrapper")
var activeOption = 'title'
var animLength = 400

$( "#loginForm" ).submit(function( event ) {
  event.preventDefault();
  $.ajax({
        url: '/login/',
        type: 'POST',
        data: $(this).serialize(),
        success: function (response) {
            window.location.href = "/roulette/";
        },
        error: function (response) {
            alert('Wrong Password')
        }
    });
});

async function runApp() {
    document.getElementsByClassName('wallet-loading-layout')[0].style.display = 'block';
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    $.ajax({
                url: '/auth',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    address: account
                }),
                success: function (response) {
                    if (response['response'] === 401) {alert("Wrong User or Password")}
                        else if (response['response'] === 200) {
                            window.location.href = "/roulette "
                        }
                },
                error: function (response) {
                    alert('Shit!')
                }
            });
}

window.addEventListener('resize', function(event){
    if (activeOption === 'login') {
        console.log(welcomeWrapper.width())
        $(".welcome").css({"left": welcomeWrapper.width()/2 + loginWindow.width()/2 + "px"}) 
    }
    if (activeOption === 'title') {
        hideModals()
    }

    if (activeOption === 'reg') {
        $(".welcome").css({"right": welcomeWrapper.width()/2 + loginWindow.width()/2 + "px"}) 
    } 
});

// сделать display: hide (проблема возникает при нажатии ТАБа)
 
function hideModals() {
    loginWindow.css({'left': "-" + (loginWindow.width() + 40) + "px"});
    regWindow.css({'right': "-" + (regWindow.width() + 40)+ "px"});
}

function showLogin() {
    $(".welcome").animate({
        left: (welcomeWrapper.width()/2 + loginWindow.width()/2) + "px"
    }, animLength, "swing", function () {
        activeOption = 'login'
    })
    animOpacity($(".title"), 0)
    animOpacity($(".modal-window-content.login"), 1)
    animOpacity($(".modal-window-content.reg"), 0)
}

function showTitle(afterReg) {
    $(".welcome").animate({
        left: "0",
        right: "0"
    }, animLength, "swing", function () {
        activeOption = 'title',
        $(".welcome").css({"left": "auto", "right": "auto"})
        if (afterReg) {
            flyWelcome()
        }
    })
    animOpacity($(".title"), 1)
    animOpacity($(".modal-window-content.login"), 0)
    animOpacity($(".modal-window-content.reg"), 0)
}

function showReg() {
    $(".welcome").animate({
        right: (welcomeWrapper.width()/2 + loginWindow.width()/2) + "px"
    }, animLength, "swing", function () {
        activeOption = 'reg';
    })
    animOpacity($(".title"), 0)
    animOpacity($(".modal-window-content.login"), 0)
    animOpacity($(".modal-window-content.reg"), 1)
}

function animOpacity(elem, opacity) {
    elem.animate({
        opacity: opacity
    }, animLength * 2/3, 'linear')
}

function flyWelcome() {
    $( "body" ).css({"overflow-y": "hidden"});
    $( ".afterRegScreen-wrapper" ).css({"display": "flex"});
    $( ".title" ).css({"transition": "all 700ms ease-in-out"});
    $( ".title" ).css({"transform": "scale(50)", "opacity": "0"});
    $( ".afterRegScreen-wrapper" ).animate({
    opacity: 1
    }, 600, "linear", function () {
        $(".welcome-wrapper").hide()
        console.log(pass)
        passwordAnim(pass);
    })
}

function waitForMs(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function passwordAnim(password) {
    await typeSentence("You may wonder why there was no password field.  Let us explain.", "#aboutPasswordBefore")
    await waitForMs(1000)
    await typeSentence("For safety reasons we generate users’ passwords automatically. Unfortunately you’re unlikely to remember them, but you can store them locally on your computer. Just create .txt document, where your password will be stored, for example.", "#aboutPasswordBefore")
    await waitForMs(1000)
    await typeSentence("You can enable double authentication option or custom password later if you want to, but our policy is to stay decentralized and we don’t want to have any private information about you, such as E-Mail, phone number or your first pet name.", "#aboutPasswordBefore")
    await waitForMs(1000)
    await typeSentence("This is your password:", "#aboutPasswordBefore")
    await waitForMs(2000)
    await typeSentence(password, "#passwordHolder")
}

async function typeSentence(sentence, eleRef, delay = 50) {
  const letters = sentence.split("");
  let i = 0;
  while(i < letters.length) {
    await waitForMs(delay);
    $(eleRef).append(letters[i]);
    i++
  }
    {$(eleRef).append("<br><br>");
  return;
}}


var pass = ''

$('#regForm').submit(function(e){
    e.preventDefault();
    $.ajax({
        url: '/register/',
        type: 'post',
        data:$('#regForm').serialize(),
        success: function (respond) {
            console.log(respond)
            $( ".submit-btn.reg" ).prop("disabled", true );
            pass = respond['password']
            console.log(pass)
            showTitle(true)
        }
    });
});

hideModals()