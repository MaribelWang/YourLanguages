var languageSelection = document.getElementById('language');
var priceRange = document.getElementById('priceRange');
var users = JSON.parse(document.getElementById('users-data').textContent);

function filterUsers(language, price) {
    return users.filter(function (element) {
        var priceCondition = Number.parseInt(element.price) <=  Number.parseInt(price);
        var languageCondition = element.language === language || language === "All Languages";
        return priceCondition && languageCondition;
    });
}

function displayUsers(filteredUsers) {
    var userList = document.getElementById('userList');
    userList.innerHTML = '';

    filteredUsers.forEach(function(element) {
        var userCard = document.createElement('div');
        userCard.className = 'col-lg-4 col-md-6 mb-3';
        userCard.innerHTML = `
        <div class="card h-100 shadow-sm">
            <div class="card-header bg-success text-white">
                <div class="d-flex justify-content-between align-items-center">
                    <img src="${element.imagePath}" class="rounded-circle" alt="${element.name}" style="width: 50px; height: 50px;">
                    <div class="ms-2">
                        <h5 class="mb-0">${element.firstName} ${element.lastName}</h5>
                        <small>${element.email}</small>
                    </div>
                    <div class="d-flex flex-column align-items-end">
                        <span class="badge bg-danger">${element.userType}</span>
                        <span class="mt-2 badge">${element.price}€/Hour</span>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <p class="card-text">${element.description}</p>
            </div>
        </div>
        `;
        userList.appendChild(userCard);
    });
}

languageSelection.addEventListener('change', function() {
    var selectedLanguage = languageSelection.value;
    var selectedPrice = priceRange.value;
    console.log('Selected Language:', selectedLanguage);

    var filteredUsers = filterUsers(selectedLanguage, selectedPrice);

    displayUsers(filteredUsers);
});

priceRange.addEventListener('input', function() {
    var selectedLanguage = languageSelection.value;
    var selectedPrice = priceRange.value;
    updatePriceDisplay(selectedPrice);
    console.log('Selected Price:', selectedPrice);
    var filteredUsers = filterUsers(selectedLanguage, selectedPrice);
    
    displayUsers(filteredUsers);
});

function updatePriceDisplay(value) {
    document.getElementById('priceDisplay').innerText = value + '€/h';
}

var initialLanguage = languageSelection.value;
var initialPrice = priceRange.value;

var initialFilteredUsers = filterUsers(initialLanguage,initialPrice);
displayUsers(initialFilteredUsers);

updatePriceDisplay(initialPrice);