const mongoose = require('mongoose')


mongoose.connect(
    process.env.MONGODB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);


const studentschema = new mongoose.Schema({
    name: String,
    classname: String,
    DOJ: Date,
    Subject: String,
    status: String,
    marks: [{
        subjectname: String,
        subjectstatus: String,
        months: [{
            month: String,
            T1: String,
            T2: String,
            T3: String
        }]
    }
    ]
})


module.exports=mongoose.model('studentmodel',studentschema)