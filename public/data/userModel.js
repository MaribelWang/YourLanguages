
// User class
class User {
  constructor(id, firstName, lastName, email, gender, userType, hashedPassword, imagePath, language, description) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.gender = gender;
    this.userType = userType;
    this.hashedPassword = hashedPassword;
    this.imagePath = imagePath;
    this.language = language;
    this.description = description;
  }
  
  // more for later
}

module.exports = User;