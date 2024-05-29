const { prisma } = require("../DB/db.config");
const { ValidPassword, generateToken } = require("../helper/helper");
const { sendResponse } = require("../lib/responseManagement");
const { user } = require("../repositories/userRepositories");
const httpStatus = require("http-status-codes").StatusCodes;
const nodemailer = require("nodemailer");
const jwt=require("jsonwebtoken")


module.exports.login = async (req, res) => {
  const {
    REGION,
    PARENT_GROUP_NAME,
    DEALER_CODE,
    DEALER_NAME,
    DEALER_STATE,
    DEALER_CITY,
    EMPLOYEE_FIRSTNAME,
    EMPLOYEE_LASTNAME,
    DESIGNATION,
    DESIGNATION_DESCRIPTION,
    MSPIN_NO,
    GENDER,
    EMPLOYEE_DOJ,
    EMPLOYEE_DOL,
    EMPLOYEE_MOBILE_NO,
    EMPLOYEE_TYPE,
   
   } = req.body;

  try {
    const newUser = await prisma.user.create({
      data: {
        REGION,
        PARENT_GROUP_NAME,
        DEALER_CODE,
        DEALER_NAME,
        DEALER_STATE,
        DEALER_CITY,
        EMPLOYEE_FIRSTNAME,
        EMPLOYEE_LASTNAME,
        DESIGNATION,
        DESIGNATION_DESCRIPTION,
        MSPIN_NO,
        GENDER,
        EMPLOYEE_DOJ,
        EMPLOYEE_DOL,
        EMPLOYEE_MOBILE_NO,
        EMPLOYEE_TYPE,
   }
    });
    const token = jwt.sign(
      { userId:newUser.id },
       process.env.SECRET,
      { expiresIn: '100d' }
    );

    
    return res.status(201).json({
      message: "User created successfully",
      user: newUser,
      token
    });

  } catch (error) {
    console.error("Error in creating user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports.getAllCourses = async (req, res) => {
  console.log("sfndjfndijfnewifnfif")
  if (!req.user || !req.user.id) {
    return res.status(400).json({ message: "Invalid request: User ID missing." });
  }
  console.log("req.user ki ye id hai",req.user);
  const { id } = req.user;
  console.log(id);
  const number_id = Number(id);
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        id: number_id,
      },
    });
    console.log(existingUser);

    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "User not found in the database" });
    }
    const allCourses = await user.getCourses(existingUser.id);
    if (allCourses.length === 0) {
      return res.status(404).json({ message: "No courses found for the user." });
    }
    return res.status(200).json({
      courses: allCourses,
    });
   
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error });
  }
};
module.exports.GetParticularCourse = async (req, res) => {
  const { id } = req.params;
  if(!id){
    return res.status(400).json({ message: "Invalid course ID provided. ID must be a numeric value." });

  }
  const number_id = Number(id);
  try {
    const exist_course = await prisma.course.findFirst({
      where: {
        id: number_id,
      },
    });
    console.log(exist_course);
    if (!exist_course) {
      return res.status(404).json({ message: "Course not available" });
    }
    return res.status(200).json({
      course: exist_course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error });
  }
};
module.exports.GetUser = async (req, res) => {

  if (!req.user || !req.user.id) {
    return res.status(400).json({ message: "Invalid request: User ID missing." });
  }
  const { id } = req.user;
  const number_id = Number(id);

  try {
    const user_find = await prisma.user.findFirst({
      where: {
        id: number_id,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.status(200).json({ data: user_find });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error });
  }
};

module.exports.SearchCourse = async (req, res) => {
  const { search_course } = req.body;
  const { id } = req.user;
  if (!search_course) {
    return res.status(400).json({ message: "Search term is required." });
  }
  if (!id) {
    return res.status(400).json({ message: "Invalid or missing user ID." });
  }
  const id_user = Number(id);
  try {
    const userWithCourses = await prisma.user.findFirst({
      where: {
        id: id_user,
      },
      include: {
        courses: true,
      },
    });
    const allCourses = userWithCourses.courses;
    
    console.log(allCourses);
    const searchPattern = search_course.replace(/\s+/g, "");
    const regexPattern = searchPattern.split("").join(".*");
    const regex = new RegExp(regexPattern, "i");
    const matchingCourses = allCourses.filter((course) => {
      const courseTitleWithoutSpaces = course.title.replace(/\s+/g, "");

      return (
        regex.test(courseTitleWithoutSpaces) ||
        courseTitleWithoutSpaces.includes(searchPattern)
      );
    });
    console.log(matchingCourses);

    if (matchingCourses.length > 0) {
      return res.status(200).json({ data: matchingCourses });
    } else {
      console.log("aara h");
      return res.status(404).send({ message: "no course" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error });
  }
};

module.exports.sendMail = async (req, res) => {
  const { fromMail, toMail, content } = req.body;
  const { file } = req;
  if(!fromMail || !toMail || !content || !file ){
    return res.status(404).send({message:"details is missing"});
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",   
    auth: {
      // user: "govindupadhyay85273@gmail.com",
      user: process.env.USER_EMAIL,
      // pass: "ulxt ahni skgw xukc",
      pass: process.env.USER_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const text = `    
    ${content}`;

  const mailOptions = {
    from: fromMail,
    to: toMail,
    subject: "Request registered",
    text: text,
    attachments: [
      {
        filename: file.originalname,
        path: file.path,
      },
    ],
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).json({ msg: "Error sending email" });
    } else {
      console.log(`Email sent: ${info.response}`);
      res.status(200).send("Email sent successfully");
    }
  });
};
