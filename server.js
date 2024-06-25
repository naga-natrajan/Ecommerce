const express=require("express")
const mongoose=require("mongoose")
const cors=require('cors')
// const bcrypt = require('bcryptjs');
const app=express()
const dotenv=require('dotenv').config();

mongoose.connect(process.env.MongoDB_URL)
.then(()=>console.log("Database is connected"))
.catch((err)=>console.log(err))

//middlewares

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 4020
          //user
//mongoose schema for user
const userSchema=new mongoose.Schema({
    fName:{
        type:String,
        required:true
    },
    lName: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true,
        unique:true
    },
    password: {
        type:String,
        required:true
    },
    confirmpassword: {
        type:String,
        required:true
    },
    image:{
        type:String
        }
})

// userSchema.methods.comparePassword = async function (candidatePassword) {
//     try {
//         return await bcrypt.compare(candidatePassword, this.password);
//     } catch (error) {
//         throw error;
//     }
// };

//user model

const userModel=mongoose.model("user",userSchema)


app.get("/",(req,res)=>{
    res.send("server is running")
})

//signup

app.post("/signup",async(req,res)=>
{
    console.log(req.body)
    const {email} = req.body
    try
    {
        const existingUser =await userModel.findOne({email})
        if(existingUser)
        {
            res.send({message:"Email is already registered",alert:false})
        }  else
        {
            const newUser=new userModel(req.body)
            await newUser.save()
            res.send({message:"Successfully signed up",alert:true})
        }
    } catch (error){
        console.error(error.message)
        res.status(500).send("Server error. please try again later ")
    }
})

//login
app.post("/login", async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            const dataexisting = {
                _id: existingUser._id,
                fName: existingUser.fName,
                lName: existingUser.lName,
                email: existingUser.email,
                image: existingUser.image
            };
            // console.log(dataexisting);
            res.send({
                message: "Login is successful",
                alert: true,
                data: dataexisting
            });
        }
        else{
            res.send({
                message: "Not a registered user.Please Sign up",
                alert: false,
               
            });
        }
    } catch {
        res.send({
            message: "Email is not registered. Please Sign Up",
            alert: false
        });
    }
});

     //Product
     //productschema
const productSchema=new mongoose.Schema({
    name:{
        type:String
    },
    category:{
        type:String
    },
    image:{
        type:String
    },
    price:{
        type:String
    },
    description:{
        type:String
    },
})
//product model
const productModel = mongoose.model("product",productSchema)
 //upload
 app.post("/uploadproduct",async(req,res)=>{
    console.log(req.body)
    const data= await productModel(req.body)
    const datasave=await data.save()
    res.send({message:"Uploded successfully"})
 })
//get product

app.get("/product",async(req,res)=>
{
    try{
        const products=await productModel.find()
        res.send(products)
    }catch{
        console.log("Error in fetching the data")
    }
})

app.listen(PORT,()=>
{
    console.log("Server is running at port : ",PORT)
})