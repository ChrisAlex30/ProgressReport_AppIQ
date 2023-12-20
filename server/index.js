const express = require('express')
const jwt=require('jsonwebtoken')
const cors=require('cors')
require("dotenv").config();


const cookieParser = require("cookie-parser");

const app = express()
const studentmodel=require('./models/studentdetail')
const teachermodel=require('./models/teacherdetail')


const port = 4000;


app.listen(port, () => {
    console.log(`server started at port:${port}`);
});

app.use(express.json())
app.use(cors())

app.use(cookieParser()); 

app.use(express.static("public"));






// Public Routes

app.post("/api/progress/logout", async (req, res) => {

    try{ 
      res.cookie("uid","")
      res.status(201).json({msg:'Logged Out!!'})       
    }
    catch(err){
      console.log(err);
      res.status(500).json({msg:"Server Error"});
    }
  });

app.post("/api/progress/login", async (req, res) => {
    let { name, password } = req.body

    try{
    if (!name || !password ) {
        res.status(401).send("please fill important fields");
        return;
    }
    
        let user = await teachermodel.findOne({ name, password })
        if (user) {
            if (user.name == "admin") {
                const token = jwt.sign({ name,role:'admin' }, process.env.SECRET_KEY, { expiresIn: '1h' });
                res.status(201).json({msg:'success',role:'admin',uid:token})               
            }
            else {
                const token = jwt.sign({ name,role:'teacher',Subjectcode:user.Subjectcode}, process.env.SECRET_KEY, { expiresIn: '1h' });
                res.status(201).json({msg:'success',role:'teacher',uid:token}) 
            }
        }
        else {
            res.status(401).json({msg:'Invalid Credentials'}) 
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({msg:"Server Error"});
      }
})

const authenticateJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {    
      jwt.verify(authHeader, process.env.SECRET_KEY, (err, username) => {
        if (err) {
            res.status(403).json({msg:"NOT AUTHORIZED"});
           }  
        else{
          // console.log(username);
          // if(Object.keys(username).length>0)
          // req.headers.cId=username.username.substring(0,3)
          // { username: 'alexSir', iat: 1691722729, exp: 1691726329 }
            if(username.role=="admin")
                req.header.role=username.role
            else{
            req.header.role=username.role
            req.header.Subjectcode=username.Subjectcode
            }
          next();
          }
      });
    } else {
        res.status(403).json({msg:"NOT AUTHORIZED"});
    }
  };


//Private Routes

                                                    //ADMIN Routes//
//get students
app.get("/api/progress/getstudents",authenticateJwt, async (req, res) => {
    try {
        const role=req.header.role
        if(role!=="admin"){
        res.status(401).json({msg:"NOT AUTHORIZED"});
        return
        }
        const users = await studentmodel.find({ status: "1" }).select({name:1,classname:1,DOJ:1,Subject:1});
        res.status(201).json(users)
    } catch (err) {
        console.log(err);
        res.status(500).json("Server Error");
    }
});

//add student
app.post("/api/progress/addstudents",authenticateJwt, async function (req, res) {
    try {

        const role=req.header.role
        if(role!=="admin"){
        res.status(401).json({msg:"NOT AUTHORIZED"});
        return
        }

        let { name, classname, DOJ, Subject } = req.body;
        // console.log(name + classname + DOJ + Subject);
        if (
            req.body.name == undefined ||
            req.body.classname == undefined ||
            req.body.DOJ == undefined ||
            req.body.Subject == undefined ||
            req.body.name == "" ||
            req.body.phno == "" ||
            req.body.DOJ == "" ||
            req.body.Subject == ""
        ) {
            res.status(401).send({msg:"Please fill all fields!!!"});
            return;
        }
        
        const stu = await studentmodel.findOne({
            name,
            classname
          });
          if(stu){
            res.status(401).json({msg:"Student Name already exists!!!"});
            return
          }

            marks = []
            let strarr = Subject.split(",")
            // strarr = ["maths", "phy", "chem"]
            strarr.forEach(subjectname => {
                let eachsubject = {
                    subjectname: subjectname,
                    subjectstatus: '1',
                    months: [{
                        month: 'january',
                        T1: '',
                        T2: '',
                        T3: ''
                    },
                    {
                        month: 'febuary',
                        T1: '',
                        T2: '',
                        T3: ''
                    },
                    {
                        month: 'march',
                        T1: '',
                        T2: '',
                        T3: ''
                    },
                    {
                        month: 'april',
                        T1: '',
                        T2: '',
                        T3: ''
                    },
                    {
                        month: 'may',
                        T1: '',
                        T2: '',
                        T3: ''
                    },
                    {
                        month: 'june',
                        T1: '',
                        T2: '',
                        T3: ''
                    },
                    {
                        month: 'july',
                        T1: '',
                        T2: '',
                        T3: ''
                    },
                    {
                        month: 'august',
                        T1: '',
                        T2: '',
                        T3: ''
                    },
                    {
                        month: 'september',
                        T1: '',
                        T2: '',
                        T3: ''
                    },
                    {
                        month: 'october',
                        T1: '',
                        T2: '',
                        T3: ''
                    },
                    {
                        month: 'november',
                        T1: '',
                        T2: '',
                        T3: ''
                    },
                    {
                        month: 'december',
                        T1: '',
                        T2: '',
                        T3: ''
                    }]
                }
                marks.push(eachsubject)
            })

            console.log(strarr);
            let status = "1"
            const user = new studentmodel({
                name,
                classname,
                DOJ,
                Subject,
                status,
                marks: marks
            });
            await user.save();
            res.status(201).json({ msg: "Student Saved" });
        
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Server Error" });
    }
})

//update student
app.put("/api/progress/updatestudent/:id",authenticateJwt, async function (req, res) {
    try {
        const role=req.header.role
        if(role!=="admin"){
        res.status(401).json({msg:"NOT AUTHORIZED"});
        return
        }

        let { name, classname, DOJ, Subject } = req.body;

        const {id}=req.params
        if (
          
            req.body.name == undefined ||
            req.body.classname == undefined ||
            req.body.DOJ == undefined ||
            req.body.Subject == undefined ||
            req.body.name == "" ||
            req.body.DOJ == "" ||
            req.body.Subject == ""
        ) {
            res.status(401).json({msg:"Please fill all fields!!!"});
            return
        }
        
            
            let strarr = Subject.split(",")
            // strarr = ["maths", "phy", "chem"]
            console.log('strarr', strarr);


            //deleting record -$nin finds the element which is not in the specified list 
            await studentmodel.updateMany(
                {
                    _id: id
                },
                {
                    $set: {
                        "marks.$[elem].subjectstatus": "0"
                    }
                },
                {
                    arrayFilters: [
                        {
                            "elem.subjectname": { $nin: strarr }
                        }
                    ]
                }
            );
            // add pre existing data

             await studentmodel.updateMany(
                { _id: id },
                {
                    $set: {
                        "marks.$[element].subjectstatus": '1'
                    }
                },
                {
                    arrayFilters: [
                        {
                            "element.subjectname": { $in: strarr },
                            "element.subjectstatus": '0'
                        }
                    ]
                }
            )

            //add new data

            // total subject there in db

            let newSubjects = [], marks1 = []
            let existingsubject = await studentmodel.findOne({ _id: id }).distinct("marks.subjectname");

            strarr.forEach((subject) => {

                if (!existingsubject.includes(subject)) {
                    newSubjects.push(subject)
                }
            });

            newSubjects.forEach(subjectname => {
                let eachsubject = {
                    subjectname: subjectname,
                    subjectstatus: '1',
                    months: [{
                        month: 'january',
                        T1: '',
                        T2: '',
                        T3: ''
                    },
                    {
                        month: 'febuary',
                        T1: '',
                        T2: '',
                        T3: ''
                    },
                    {
                        month: 'march',
                        T1: '',
                        T2: '',
                        T3: ''
                    },
                    {
                        month: 'april',
                        T1: '',
                        T2: '',
                        T3: ''
                    },
                    {
                        month: 'may',
                        T1: '',
                        T2: '',
                        T3: ''
                    },
                    {
                        month: 'june',
                        T1: '',
                        T2: '',
                        T3: ''
                    },
                    {
                        month: 'july',
                        T1: '',
                        T2: '',
                        T3: ''
                    },
                    {
                        month: 'august',
                        T1: '',
                        T2: '',
                        T3: ''
                    },
                    {
                        month: 'september',
                        T1: '',
                        T2: '',
                        T3: ''
                    },
                    {
                        month: 'october',
                        T1: '',
                        T2: '',
                        T3: ''
                    },
                    {
                        month: 'november',
                        T1: '',
                        T2: '',
                        T3: ''
                    },
                    {
                        month: 'december',
                        T1: '',
                        T2: '',
                        T3: ''
                    }]
                }
                marks1.push(eachsubject)
            })

            // console.log(marks1);
            // //update name,classname and doj
            await studentmodel.updateOne(
                { _id: id },
                {
                    $set: {
                        name: name,
                        class: classname,
                        DOJ: DOJ,
                        Subject: Subject
                    },
                    $push: {
                        marks: {
                            $each: marks1
                        }
                    }
                }
            );

            res.status(201).json({msg:"Student Updated"})
        
    }
    catch (err) {
        console.log(err);
        res.status(500).json({msg:'Not Updated'}) 
    }
})

//delete student
app.put("/api/progress/deletedata/:id",authenticateJwt, async (req, res) => {

    try {
        const role=req.header.role
        if(role!=="admin"){
        res.status(401).json({msg:"NOT AUTHORIZED"});
        return
        }
        let { id } = req.params;
       
        await studentmodel.findByIdAndUpdate(id, { status: "0" });
        res.status(201).json({msg:"Student Deleted"});
    } catch (err) {
        console.log(err);
        res.status(500).json({msg:'Not Deleted'})  
    }
});


//get deleted students
app.get("/api/progress/getdeletedstudents",authenticateJwt, async (req, res) => {
    try {
        const role=req.header.role
        if(role!=="admin"){
        res.status(401).json({msg:"NOT AUTHORIZED"});
        return
        }
        const users = await studentmodel.find({ status: "0" });
        res.status(201).json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json({msg:'Server Error'})  
    }
});


//revert deleted students
app.put("/api/progress/revertdeletedstudents",authenticateJwt, async (req, res) => {
    try {
        const role=req.header.role
        if(role!=="admin"){
        res.status(401).json({msg:"NOT AUTHORIZED"});
        return
        }

        let { SIds } = req.body;
        if (!SIds) {
            res.status(401).json({msg:"please select some students !!!"});
            return;
        }

        
        await studentmodel.updateMany(
            { _id: { $in: SIds } },
            {
                $set: {
                    "status": '1'
                }
            }
        );
        res.status(201).json({msg:"Reverted Deleted Student"});
    } catch (err) {
        console.log(err);
        res.status(500).json({msg:'Server Error'})  
    }
});



                                                    // TEACHERS Routes//
                                                    
//get students of a subject teacher class and month wise
app.get("/api/progress/studentdetails/:month/:classname",authenticateJwt, async (req, res) => {
    try {
        const role=req.header.role
        if(role!=="teacher"){
            res.status(401).json({msg:"NOT AUTHORIZED"});
            return
        }
        let { month, classname } = req.params;
        let subjectcode=req.header.Subjectcode 
        
        if(!month || !classname){
            res.status(401).json({msg:"Please select the required fields. !!"});
            return
        }
        
        let users = await studentmodel.find(
            {                
                status:"1",
                marks:{$elemMatch:{subjectname: subjectcode,subjectstatus: "1"}},
                classname: classname
            }).select({_id: 1,name:1,className:1,doj:1,marks:{$elemMatch:{subjectname: subjectcode,subjectstatus: "1"}}})
            
        if(users && users.length!==0){
           users= users.map(user=>{
           const mon= user.marks[0].months.filter(element=>element.month===month)
           return {
            id:user._id ,
            name:user.name,
            month:mon        
           }
           })                  
        }
        res.status(201).json(users);
    } 
    catch (err) {
        console.log(err);
        res.status(500).json({msg:'Server Error'})  
    }
});


//update student's test marks(T1 T2 and T3) of a subject for a month 
app.put("/api/progress/updatestudentdata/:id", async (req, res) => {
    const { T1,T2,T3, month } = req.body
    const { id } = req.params;
    const subjectcode=req.header.Subjectcode

    if(!id || !month || !T1 || !T2 || !T3){
        res.status(401).json({msg:"Please select the required fields. !!"});
        return
    }

    try {
        await studentmodel.updateOne(
            {
                 _id: id,
                "marks": {
                    $elemMatch: {
                        "subjectname": subjectcode,
                    }
                }
            },
            {
                $set: {
                    "marks.$.months.$[elem].T1": T1,
                    "marks.$.months.$[elem].T2": T2,
                    "marks.$.months.$[elem].T3": T3
                }
            }, {
            arrayFilters: [{ "elem.month": month }]
        }
        )

        res.status(201).json({msg:'Student Marks Updated'});
    }
    catch (e) {
        console.log(e);
        res.status(500).json({msg:'Server Error'}) 
    }
})



