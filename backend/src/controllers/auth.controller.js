//auth.controller.js file

//To API's hum routes ma banay ga , lakin us API ma jo logic hoga wo hum is file ma likhain ga.

const userModel = require("../models/user.model"); //1st part --> from user.model.js file
const foodPartnerModel = require("../models/foodpartner.model");
const bcrypt = require("bcryptjs"); //5th part
const jwt = require("jsonwebtoken"); // 8th part

async function registerUser(req, res) {
  // 2nd part
  const { fullName, email, password } = req.body;

  //fullName, email, password ya 3 cheezain hama req.body sa milain gi, but here is a catch --> abhi hama nahi(yani filhal hama nahi milaingi) milain gi, kio ka by default hum jo express sa by default server create karta hain, wo server by default req.body sa data par hi nahi sakta ya aik problem ha but iska solution bohet easy ha. or wo kiya aik --> middleware , go to app.js and see this app.use(express.json());
  //--> now see the porblem is not ka frontend sa data nahi araha the problem is --> server us data ko par nahi sakta req.body ma , now ya middleware req.body ma data la ka ata ha or usa readable banata ha taka hum uska sath kuch kaam kar sakain

  //Now every thing is done data is here server can see it, now will see ka is email sa koi or account exist to nahi karta..

  const isUserAlreadyExists = await userModel.findOne({
    //3rd part
    email,
  });

  if (isUserAlreadyExists) {
    //4th part
    // ab kio ka account pahla sa exist kar raha ha is email pa to hama response send karna hoga or us kaliya hum status code ka sahara lata hain, but ab konsa code kis time use karna ha this is a question?
    return res.status(400).json({
      message: "User already exists",
    });
  }
  // lakin ager koi bhi user exist nahi karta , then hum us user ko create karain gain, But user create karna sa pahla bhi hama aik or kaam karna ha i.e --> password ko Hash karna, But why?
  //The answer is --> pssword ko hash isliya karna ha take ager hamara database breech hojay is condition ma bhi hum apna user ki privacy ko protect kar sakain/ user's ka account secure kar sakta hain to isliya hama password hash karna bohot zarori hota ha.
  //password hash karana kaliya ham aik library ka istamal karain ga i.e --> bcryptjs , to pahla isa install karlo i.e by using --> npm i bcryptjs
  // ab hama bcrypt ko require karana hoga --> oper

  //now do hash password
  const hashedPassword = await bcrypt.hash(password, 10); //6th part (we are  using 10 rounds here?)

  //now finally we will create user:
  const user = await userModel.create({
    //7th part
    fullName,
    email,
    password: hashedPassword,
  });

  //now after this user technically register hochoka ha, par ab agli bar jub wo request kara hamra server pa to pata to chala ka kahan sa request arahi ha, to iskaliya hum token create karta han or phir us token ko hum cookies ma save karata hain

  //ab token create karna kaliya hama chahiya package jis ka name ha  jasonwebtoken or cookies ma token ko save karna kaliya aik package or chahiya jiska name ha cookie-parser
  //so packages ko install karo. i.e --> npm i jsonwebtoken cookie-parser
  //now also require that at the top.
  //iska bad
  //we will not use cookie-parser here, we will use it in -->app.js --> as a middle ware

  // now creating token here (token create karna kaliya hum jwt.sign() function ka istamal karta hain)
  const token = jwt.sign(
    {
      //9th part
      id: user._id, // jo user create kiya ha uski id
      // now jo token hum create karta hain hum unique data data hain object ki form ma , pahla id which is unique, second jwt secreate --> which you have to create from online using any website search --> jwt secret generator
    },
    process.env.JWT_SECRET,
  ); //jitni bari key otni ziyada security but performance slow server ki to need balance

  res.cookie("token", token); // 10 part (token name sa hum na isa cookie ma save kiya)

  // after saving
  res.status(201).json({
    // 11 part (201 resource code kio kio ka aik naya resource create ho raha ha)
    message: "User registered successfully",
    user: {
      // ka data front-end pa share kar raha hain
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      //password hum kio nahi bhaj raha, front-end  pa hum password kabhi bhi nahi bhaajta, par kio--> security resons.
    },
  });
}

async function loginUser(req, res) {
  //13 part
  //idher hamra pass do cheezain ayngi i.e email & password in req.body --> to hum us sa ya extract karain ga.
  //destructuring the data
  const { email, password } = req.body;

  //sab sa pahla check karain ga ka is email sa koi account exist karta ha ka nahi
  const user = await userModel.findOne({
    email,
    //checking account based on email form DB
  });

  //if user did not exist with this email
  if (!user) {
    return res.status(400).json({
      message: "Invalid email or password",
      //why we are sending Invalid email or password, why not only Invalid email
      //Because there are some attacks brootforce or another one dictionary one of them is used during attacks account ka access unathorize tareeka sa lana kaliya
      //to in donon attack sa bachna kaliya or isa or delay karna kaliya hum--> hum responce bhaajta hain Invalid email or password
      //-->details khod dakho
    });
  }
  //if user exist
  //comparinf with the password in DB
  const isPasswordValid = await bcrypt.compare(password, user.password);

  // if password not mattached
  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  //if email and password both are Valid then --> create token

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    // here we have one problem over jwt secret code is exposed every one can accesss it, kasa ka ager ma is code ko github pa daldata hon to har koi isa access karlaga joka ghalata ha security point of view sa, but why?
    // har koi isko alada aik .env file ma store karta ha and then use it there as you can see,
    // abhi bhi hum is ko directly use nahi karsakta in over code it will be undefine
  );

  //setting token in cookie
  res.cookie("token", token);

  //Now finally sending success responce
  res.status(200).json({
    message: "User logged in successfully",
    user: {
      // ka data front-end pa share kar raha hain
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      //password hum kio nahi bhaj raha, front-end  pa hum password kabhi bhi nahi bhaajta, par kio--> security resons.
    },
  });
}

function logoutUser(req, res) {
  res.clearCookie("token");
  res.status(200).json({
    message: "User logged out successfully",
  });
}

// -----------------CONTROLLERS FOR FOOD PARTNER----------------------
async function registerFoodPartner(req, res) {
  const { name, email, password, phone, address, contactName } = req.body;

  const isAccountAlreadyExists = await foodPartnerModel.findOne({
    email,
  });

  if (isAccountAlreadyExists) {
    return res.status(400).json({
      message: "Food partner account already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const foodPartner = await foodPartnerModel.create({
    name,
    email,
    password: hashedPassword,
    phone,
    address,
    contactName,
  });

  const token = jwt.sign(
    {
      id: foodPartner._id,
    },
    process.env.JWT_SECRET,
  );

  res.cookie("token", token);

  res.status(201).json({
    message: "Food partner registered successfully",
    foodPartner: {
      _id: foodPartner._id,
      email: foodPartner.email,
      name: foodPartner.name,
      phone: foodPartner.phone,
      address: foodPartner.address,
      contactName: foodPartner.contactName,
    },
  });
}

async function loginFoodPartner(req, res) {
  const { email, password } = req.body;

  const foodPartner = await foodPartnerModel.findOne({
    email,
  });

  if (!foodPartner) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, foodPartner.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  const token = jwt.sign(
    {
      id: foodPartner.id,
    },
    process.env.JWT_SECRET,
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "Food partner looged in successfully",
    foodPartner: {
      _id: foodPartner._id,
      email: foodPartner.email,
      name: foodPartner.name,
    },
  });
}

function logoutFoodPartner(req, res) {
  res.clearCookie("token");
  res.status(200).json({
    message: "Food partner logged out successfully",
  });
}

// now we have to export this registerUser controler that we have created, but the problem is, is file ma bohot sara contoller hum na create karna hain, and hum aik file sa sirf aik hi ceez export kar sakta hain.
// to hum isko simple is tarhan nahi likh sakta --> module.exports = registerUser   , Because in this case only one cntroller is exporting.

// so this is a problem, but the solution is very simple --> we will use Object to export and inside that object we will export all the contollers

// now it can have multiple controllers
module.exports = {
  //12th part
  //----user----
  registerUser,
  loginUser,
  logoutUser,
  //---foodPartner----
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner,
};

//require it in auth.routes.js
