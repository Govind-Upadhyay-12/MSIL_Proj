const { prisma } = require("../DB/db.config");
const { ValidPassword, generateToken } = require("../helper/helper");
const { sendResponse } = require("../lib/responseManagement");
const { user } = require("../repositories/userRepositories");
const httpStatus = require("http-status-codes").StatusCodes;


module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    if (!email || !password)
      return res.status(400).json({ msg: "Please enter all fields" });
    const existingUser = await user.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const isValidPassword = await ValidPassword(
      password,
      existingUser.password
    );
    if (!isValidPassword) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    const token = await generateToken(existingUser._id);
    return res.status(200).json({ token, userId: existingUser._id });
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getAllCourses = async(req, res) => {
  const {id}=req.params;
  console.log(id);
 const number_id=Number(id);
  try {
    const existingUser = await prisma.user.findFirst({
      where:{
        id:number_id
      }
    })
    console.log(existingUser)
   
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const allCourses = await user.getCourses(existingUser.id);
    return res.status(200).json({
      courses:allCourses
    })
    
  } catch (error) {
    console.log(error);
    return res.status(500).send({message:error})
    
  }
}
module.exports.GetParticularCourse=async(req,res)=>{
  const {id}=req.params;
  const number_id=Number(id);
  try {
    const exist_course=await prisma.course.findFirst({
      where:{
        id:number_id
      }
    })
    console.log(exist_course);
    if(!exist_course){
      return res.status(404).json({ message: "Course not available" });
    }
    return res.status(200).json({
      file:exist_course
    })
    
  } catch (error) {
    console.log(error);
    return res.status(500).send({message:error});
    
  }
}
module.exports.GetUser=async(req,res)=>{
  const {id}=req.params;
  const number_id=Number(id);
  
  try {
    const user_find=await prisma.user.findFirst({
      where:{
        id:number_id
      
      },
      include:{
        Adds:true,
      }
    })
    return res.status(200).json({data:user_find});
    
  } catch (error) {
    console.log(error);
    return res.status(500).send({message:error});
    
  }
}

