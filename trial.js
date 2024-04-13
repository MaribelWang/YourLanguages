var languageSelection = document.getElementById('language');
var priceRange = document.getElementById('priceRange');
var users = JSON.parse(document.getElementById('users-data').textContent);

function filterUsers(language, price) {
    return users.filter(function(element) {
        var priceCondition = element.price <= price || price === 0;
        var languageCondition = element.language === language || language === "All Languages";
        return priceCondition && languageCondition;
    });
}

function displayUsers(filteredUsers) {
    var userList = document.getElementById('userList');
    userList.innerHTML = '';

    filteredUsers.forEach(function(element) {
        // Your user card code...
    });
}

languageSelection.addEventListener('change', function() {
    var selectedLanguage = languageSelection.value;
    var selectedPrice = priceRange.value;
    var filteredUsers = filterUsers(selectedLanguage, selectedPrice);

    displayUsers(filteredUsers);
});

priceRange.addEventListener('input', function() {
    var selectedLanguage = languageSelection.value;
    var selectedPrice = priceRange.value;
    updatePriceDisplay(selectedPrice);
    var filteredUsers = filterUsers(selectedLanguage, selectedPrice);

    displayUsers(filteredUsers);
});

function updatePriceDisplay(value) {
    document.getElementById('priceDisplay').innerText = value + '€/h';
}

var initialLanguage = languageSelection.value;
var initialPrice = priceRange.value;
var initialFilteredUsers = filterUsers(initialLanguage, initialPrice);
displayUsers(initialFilteredUsers);

// Call this function initially to display the initial price
updatePriceDisplay(initialPrice);
