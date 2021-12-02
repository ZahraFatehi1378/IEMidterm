var searchedName = "";

// save data in local storage , searchedName is the entered name and value is 1 for male and 2 for female
function saveData(value) {
    localStorage.setItem(searchedName, value);
}

// get data from local storage
function readData() {
    return localStorage.getItem(searchedName);
}

// remove data from local storage
function removeData() {
    localStorage.removeItem(searchedName);
}

// check constraint and save data 
function checkSavedAnswer() {
    if (searchedName.length > 0 && searchedName in localStorage) {
        var x = readData();
        if (x != 1 && x != 2) {
            document.getElementById("saved").style.visibility = "hidden";
            return;
        }
        document.getElementById("saved_response").innerHTML = "<b>" + searchedName + "</b> is " + (x == 1 ? "male" : "female");
        document.getElementById("radio" + x).checked = true;
        document.getElementById("saved").style.visibility = "visible";
    } else {
        document.getElementById("saved").style.visibility = "hidden";
    }
}

// connect to api and get data 
var HttpClient = function () {
    this.get = function (aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function () {
            if (anHttpRequest.readyState == 4)
                if (anHttpRequest.status == 200)
                    aCallback(anHttpRequest.responseText);
                else
                    aCallback("error");
        }

        anHttpRequest.open("GET", aUrl, true);
        anHttpRequest.send(null);
    }
}

// shaking animation
function shakeAnimInit() {
    document.getElementById("input-parent").addEventListener('animationend', shakeAnim);
    document.getElementById("radio-parent1").addEventListener('animationend', shakeAnimRadio);
    document.getElementById("name-input").onkeypress = function (e) {
        if (!e) e = window.event;
        var keyCode = e.code || e.key;
        if (keyCode == 'Enter') {
            submit();
            return false;
        }
    }
}

// shaking animation for text field
function shakeAnim() {
    document.getElementById("input-parent").classList.toggle("shake");
}

// shaking animation for radio buttons
function shakeAnimRadio() {
    document.getElementById("radio-parent1").classList.toggle("shake");
    document.getElementById("radio-parent2").classList.toggle("shake");
}

// submit data and get data from api
function submit() {
    var name = document.getElementById("name-input").value;
    if (name.trim().length == 0) {
        shakeAnim();
        return;
    }
    searchedName = name;
    checkSavedAnswer();
    var client = new HttpClient();
    document.getElementById("response").innerHTML = "Wait a moment...";
    document.getElementById("loading").style.visibility = "visible";
    client.get('https://api.genderize.io/?name=' + name, function (response) {
        document.getElementById("loading").style.visibility = "hidden";
        if (response == "error") {
            document.getElementById("response").innerHTML = "Something went wrong!";
        } else {
            const obj = JSON.parse(response);
            if (obj.gender != null) {
                document.getElementById("response").innerHTML = "<b>" + obj.name + "</b> is " + obj.gender + " <span class=\"colored\">(" + (obj.probability * 100) + "%)</span>";

                if (!(searchedName in localStorage)) {
                    document.getElementById("radio" + (obj.gender == 'male' ? 1 : 2)).checked = true;
                }
            } else {
                document.getElementById("response").innerHTML = "Couldn't predict gender of " + obj.name + "!";
            }
        }
    });
}

// save data after checking data is valid
function save() {
    var name = document.getElementById("name-input").value;
    if (name.trim().length == 0) {
        shakeAnim();
        return;
    }
    searchedName = name;

    if (document.getElementById("radio1").checked == true)
        saveData(1);
    else if (document.getElementById("radio2").checked == true)
        saveData(2);
    else {
        shakeAnimRadio();
        return;
    }

    checkSavedAnswer();
}

// remove data and hide div with save id
function clearNow() {
    removeData();
    document.getElementById("saved").style.visibility = "hidden";
}
