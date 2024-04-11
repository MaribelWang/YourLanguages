class User {
    constructor(id, name, lastName, email, gender, userType, hashedPassword, imagePath, language,description) {
        this.id = id,
            this.name = name,
            this.lastName = lastName,
            this.email = email,
            this.gender = gender,
            this.userType = userType,
            this.hashedPassword = hashedPassword,
            this.imagePath = imagePath,
            this.language = language,
            this.description = description
    }
}

module.exports = User