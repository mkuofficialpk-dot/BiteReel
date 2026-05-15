//user.model.js file
const mongoose = require('mongoose'); // 1st part

//here we will create user Schema
const userSchema = new mongoose.Schema({  //2nd part
    fullName: {
        type: String,
        required: true // means full name is requird must.
    },
    email: {
        type: String,
        required: true,
        unique: true, // means aik email ka sath hum aik hi account create kar sakta hain, dosra account ap same    account ka sath create nahi kar sakta
    },
    password: {
        type: String, // we are not using requird here because when we will use google auth so there password does't need.
    }
},
    {
        timestamps: true //it gives info about when user was created , last time ap na ussa kub update kiya tha etc to yanah database is filed ma ya maintain karta ha
    }
)

const userModel = mongoose.model("user", userSchema); //3rd part

module.exports = userModel;  // 4th part

// so untill now what we have done is have created userSchema and also userModel, now we can perform any action on it 
//now see in --> auth.controller.js we will require this User model we have created.