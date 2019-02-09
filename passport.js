const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const {MongoClient} = require("mongodb")
const MURL = "mongodb://localhost:27017"

var data
MongoClient.connect(MURL, { useNewUrlParser: true }, (err,client) => {
  if(err){
      console.error(err)
      console.error("Error Encountered")
  }
  
  data = client.db("datasnu")
})


passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const Seller = data.Seller.findOne({User_Name: username}, (err,result) => {
        if(err) throw err;

        if (!result) {
          return console.log("Invalid user")
        }

        if (result.Password !== password) {
          return console.log("Password invalid")
        }
      })
    } catch (e) {
      console.log("error")
    }
  }
))

passport.serializeUser(
  (user, done) => {
    done(null, user.id)
  }
)

passport.deserializeUser(
  (userId, done) => {
    Users.findOne({
      where: {id: userId}
    })
    .then((user) => done(null, user))
    .catch(done)
  }
)

module.exports = passport
