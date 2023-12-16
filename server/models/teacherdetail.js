const mongoose = require('mongoose')


mongoose.connect(
    process.env.MONGODB_URI ,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);



const teacherschema = new mongoose.Schema({
    name: String,
    password: String,
    Subjectcode: String
})



module.exports=mongoose.model('teachermodel',teacherschema)