var languageSelection = document.getElementById('language');
var users = JSON.parse(document.getElementById('users-data').textContent);

function filterUsers(language) {
    if (language === "All Languages") {
        return users;
    }

    var filteredUsers = users.filter(function(element) {
        return element.language === language;
    });

    return filteredUsers;
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
                        <span class="badge bg-danger">${element.userType}</span>
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
    console.log('Selected Language:', selectedLanguage);

    var filteredUsers = filterUsers(selectedLanguage);

    displayUsers(filteredUsers);
});

var initialLanguage = languageSelection.value;
var initialFilteredUsers = filterUsers(initialLanguage);
displayUsers(initialFilteredUsers);
