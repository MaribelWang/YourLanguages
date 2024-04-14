
// User class
class User {
  constructor(id, firstName, lastName, email, gender, userType, hashedPassword, imagePath, language, description, price) {
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
    this.price = price;
  }
  
  getId() {
    return this.id
  }

  setId(id) {
    this.id = id
  }

  getFirstName() {
    return this.firstName
  }

  setFirstName(firstName) {
    this.firstName = firstName
  }

  //TODO: Implement the rest of the getters and setters


}

module.exports = User;