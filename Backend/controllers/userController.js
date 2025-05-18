import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"

//Login user

const loginUser = async (req,res)=>{
    const {email,password} = req.body;
    try {
        const user = await userModel.findOne({email});

        if (!user) {
            return res.json({success:false,message:"User Does't exist"})
            
        }
        const isMatch = await bcrypt.compare(password,user.password);

        if (!isMatch) {
            return res.json({success:false,message:"Invalid Credentials"})
            
        } 
        const token = createToken(user._id);
            res.json({success:true,token})
    } 
    catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
        
        
    }

}
const createToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

//resiter user

const resisterUser = async(req,res)=> {
    const{name,password,email} = req.body;
    try {
        // checkong user already exist
        const exist = await userModel.findOne({email});
        if (exist) {
            return res.json({success:false,message:"User already exist"})
        }
        //validating email format and strong password
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Please enter a valid email"})
        }
        if (password.length<8) {
            return res.json({success:false,message:"please enter the strong Password"})
            
        }
        //hashing user pss
        const salt = await bcrypt.genSalt(10)
        const hashedPassword= await bcrypt.hash(password,salt);

        const newUser = new userModel({
            name:name,
            email:email,
            password:hashedPassword
        })

        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({success:true,token});

    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
        
    }
}

export {loginUser,resisterUser}