// JavaScript to change the label text based on userType selection
document.addEventListener('DOMContentLoaded', function() {
    var userTypeSelect = document.getElementById('userType');
    var languageLabel = document.getElementById('languageLabel');

    // Function to update the label text
    function updateLabel() {
        if (userTypeSelect.value === 'teacher') {
            languageLabel.textContent = 'Language You Want to Teach:';
        } else {
            languageLabel.textContent = 'Language You Want to Learn:';
        }
    }

    // Event listener for change on userType select
    userTypeSelect.addEventListener('change', updateLabel);

    // Call updateLabel on page load in case userType is pre-selected
    updateLabel();
});
