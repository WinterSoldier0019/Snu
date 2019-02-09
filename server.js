const express = require("express")
const session = require("express-session")
const {MongoClient} = require("mongodb")
const path = require("path")
const passport = require("./passport")
const MURL = "mongodb://localhost:27017"

const app = new express()

var data
MongoClient.connect(MURL, { useNewUrlParser: true }, (err,client) => {
    if(err){
        console.error(err)
        console.error("Error Encountered")
        Window.alert("There Is an Error")
    }
    
    data = client.db("datasnu")
})

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.set("view engine" ,"ejs")

app.use(session({
    secret: "cfgvbhjnvyctfgvbhjgcfgvhbj",
    resave: false,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(express.static("public"));
app.use("/",express.static(path.join(__dirname,"public1")))
app.use("/store/",express.static(path.join(__dirname,"public2")))
app.use("/user/",express.static(path.join(__dirname,"public3")))

app.get("/", (req,res) => {
    res.status(201).render("home.ejs")
})
app.get("/about/", (req,res) => {
    res.status(201).render("about.ejs")
})
app.get("/store/", (req,res) => {
    res.status(201).render("store.ejs")
})
app.get("/user/", (req,res) => {
    res.status(201).render("user.ejs")
})
app.get("/store/login", (req,res) => {
    res.status(201).render("login.ejs")
})

app.get("/store/signup", (req,res) => {
    res.status(201).render("signup.ejs")
})

app.post("/store/signup", (req,res) => {
    try
    {
        Seller = data.collection("Seller")
        let seller = {
            User_Name: req.body.username,
            Password: req.body.password
        }
        Seller.insertOne(seller, (err,result) => {
            if(err) 
            {
                console.error(err)
                console.log("There is error")
            }
            console.log("Created Successfully")    
            console.log(result)
            return res.status(201).redirect("/store/login")
        })
    }
    catch(err) 
    {
        console.log("Not Created")
        res.redirect("/store/signup/")
    } 
})

app.post("/store/login", passport.authenticate("local", {
    failureRedirect: "/store/login",
    successRedirect: "/store/profile"
})
)

app.get("/store/profile", (req,res) => {
    if(req.user)
    {
        res.status(201).render("profile", {user: req.user})
    }
    else
    {
        res.status(303).redirect("/store/login")
    }
})

app.post("/store/profile",(req,res) => {

    const store = data.collection("Store")
    let info = {
        Store_Name: req.body.storename,
        Owner_Name: req.body.ownername,
        Store_Address: req.body.address,
        Phone_Number: req.body.number,
    }
    store.insertOne(info,(err,result) => {
        if(err){
            console.error(err)
            console.error("There is an Error")
        }
        console.log("Added Successfully")
        console.log(result)    
    })
    return res.status(201).send("Added Successfully")
})

app.post("/store/medicines",(req,res) => {

    const medicines = data.collection("Medicines")
    let info = {
        Medicine_Name: req.body.storename,
        Company_Name: req.body.ownername,
        Date_Mfg: req.body.address,
        Date_Exp: req.body.number,
    }
    medicines.insertOne(info,(err,result) => {
        if(err){
            console.error(err)
            console.error("There is an Error")
        }
        console.log("Added Successfully")
        console.log(result)    
    })
    return res.status(201).send("Added Successfully")
})

app.get("/store/medicines/", (req,res) => {
    res.render("medicines")
})

app.get("/store/medicines", (req,res) => {
    if(req.user)
    {
        res.status(201).render("medicines", {user: req.user})
    }
    else
    {
        res.status(303).redirect("/store/profile")
    }
})








app.get("/user/login", (req,res) => {
    res.status(201).render("customer.ejs")
})

app.get("/user/signup", (req,res) => {
    res.status(201).render("signup2.ejs")
})

app.post("/user/signup", (req,res) => {
    try
    {
        const User = data.collection("Users")
        let user = {
            User_Name: req.body.username,
            Password: req.body.password
        }
        User.insertOne(user, (err,result) => {
            if(err) 
            {
                console.error(err)
                console.log("There is error")
            }
            console.log("Created Successfully")    
            console.log(result)
            return res.status(201).redirect("/user/login")
        })
    }
    catch(err) 
    {
        console.log("Not Created")
        res.redirect("/user/signup/")
    } 
})

app.post("/user/login", passport.authenticate("local", {
    failureRedirect: "/user/login",
    successRedirect: "/user/profile"
})
)

app.get("/user/profile", (req,res) => {
    if(req.user)
    {
        res.status(201).render("profile", {user: req.user})
    }
    else
    {
        res.status(303).redirect("/user/login")
    }
})

app.post("/user/profile",(req,res) => {
    /*Main Logic*/
})

app.listen(4567, () => {
    console.log("Server started at http://localhost:4567")
})
