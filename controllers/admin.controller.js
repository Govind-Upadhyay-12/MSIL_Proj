// const {admin}=require("../repositories/userRepositories")
// module.exports = addCourse = async(req, res) =>{
//       console.log(req.body);
//      console.log("ye h req.body",req.file.filename)
//   try {
//     const video=await admin.createCourse(req.body,req.file)
//     return res.status(200).send({message:"video uploaded"})
    
//    } catch (error) {
//     console.log(error);
//     return res.status(500).json({message:error})

    
//    }
// }

// module.exports = assignCourse = async(req, res) => {
//   const {userEmail, courseName} = req.body;
//   try {
//     const isCourseExist = await admin.findCourse({name: courseName});
//     if(!isCourseExist) {
//       return res.status(400).json({message:"no course assign"});
//     }
//     const isUserExist = await user.findOne({email: userEmail});
//     if(!isUserExist) {
//       return res.status(404).json({msg: "Uesr not found"});
//     }
//     await admin.addCourse({user: isUserExist.id, courseId: isCourseExist.id});
//     return res.status(200).json({msg: "Course added successfully"});

//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({msg: "Internal Server Error"});
//   }
// }


const { admin } = require("../repositories/userRepositories");
const { user } = require("../repositories/userRepositories"); // Importing user repository

module.exports.addCourse = async (req, res) => {
  console.log(req.body);
  console.log("ye h req.body", req.file.filename); //YAHAN SE VODEP
  try {
    const video = await admin.createCourse(req.body, req.file);
    return res.status(200).send({ message: "Video uploaded" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
 
module.exports.assignCourse = async (req, res) => {
  const { userEmail, courseName } = req.body;
   console.log(userEmail, courseName);
  try {
    const isCourseExist = await admin.findCourse({title:courseName}); // Corrected property name to 'title'
    if (!isCourseExist) {
      return res.status(400).json({ message: "Course does not exist" }); // Updated error message
    }
    console.log(`course mil gya ${isCourseExist}`) 
    const isUserExist = await user.findOne({ email:userEmail }); // Using user repository's findOne method
    if (!isUserExist) {
      return res.status(404).json({ message: "User not found" });
    }
    await admin.addCourse({ userId: isUserExist.id, courseId: isCourseExist.id }); // Changed 'user' to 'userId'
    return res.status(200).json({ message: "Course added successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports.Addadds=async(req,res)=>{
  console.log(req.file); 
  try {
    const createAdd=await admin.createAdd(req.file);
    return res.status(200).send({message:"Add_created_successfully_to all users"});
  } catch (error) {
    console.log(error);
    return res.status(500).send({message:error});
    
  }

}
 