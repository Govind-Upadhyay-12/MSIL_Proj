const e = require("express");
const { prisma } = require("../DB/db.config");
const { admin } = require("../repositories/userRepositories");
const { user } = require("../repositories/userRepositories");
const path=require("path")

const { generateToken } = require("../helper/helper");
module.exports.addCourse = async (req, res) => {
  console.log(req.body);
  console.log("ye h req.body", req.file.filename);

  try {
    const course = await admin.createCourse(req.body, req.file);

    return res.status(200).json({
      statusCode: 200,
      message: "Course added successfully",
      course: course,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      data: error,
    });
  }
};


module.exports.assignCourse = async (req, res) => {
  const { REGION, MSPIN_NO, module_name } = req.body;
  console.log("Request body in assign:", req.body);

  if (!REGION && !MSPIN_NO) {
    return res.status(404).send({ message: "Enter at least one field to assign a course: REGION or MSPIN_NO." });
  }

  if (!module_name) {
    return res.status(404).send({ message: "Enter the course name." });
  }

  try {
    const course = await prisma.course.findFirst({
      where: { module_name },
    });

    if (!course) {
      return res.status(400).json({ message: "Course does not exist." });
    }
    console.log(`Course found: ${course.module_name}`);

    let query = {};
    if (REGION) query.REGION = REGION;
    if (MSPIN_NO) query.MSPIN_NO = MSPIN_NO;

    const users = await prisma.user.findMany({ where: query });

    if (users.length === 0) {
      return res.status(404).send({ message: "No users found for the given criteria." });
    }

    for (const user of users) {
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            courses: {
              connect: { id: course.id },
            },
          },
        });
        console.log(`Course ${course.id} assigned to user ${user.id}`);
      } catch (error) {
        console.error("Error in adding course to user:", error);
        // Continue processing other users even if one fails
      }
    }

    return res.status(200).json({
      statusCode: 200,
      message: `Course assigned successfully to all users based on the provided criteria.`,
    });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.Addadds = async (req, res) => {
  console.log(req.file);
  try {
    if (!req.file) {
      return res
        .status(404)
        .send({ message: "file is not there to create adds" });
    }
    const createAdd = await admin.createAdd(req.file);
    return res
      .status(200)
      .send({ message: "Add_created_successfully_to all users" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error });
  }
};
module.exports.GettingAdds = async (req, res) => {
  try {
    const All_Adds = await prisma.adds.findMany();
    console.log(All_Adds);
    if (!All_Adds) {
      return res.status(404).send({ message: "No Adds" });
    }
    return res.status(200).json({ ads: All_Adds });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error });
  }
};

module.exports.findCourseByCategory = async (req, res) => {
  const { category } = req.query;
  try {
    if (!category) {
      return res.status(404).send({ message: "category is missing" });
    }
    const data = await admin.findCourseByCategory(req.query);
    console.log(data);
    return res.status(200).json({ statusCode:200,
      category:data
     });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: error,
    });
  }
};

module.exports.Admin_login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Both email and password are required." });
  }

  try {
    const admin = await prisma.admin.findFirst({
      where: {
        email: email,
      },
    });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (admin.password === password) {
      const token = generateToken(admin.id);
      return res.status(200).send({
        statusCode: 200,
        message: "Admin login",
        token,
      });
    } else {
      return res.status(401).json({ message: "Incorrect password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



module.exports.All_Courses = async (req, res) => {
  try {
      const { start, length, columns, order, search, draw } = req.body;

      const offset = start;
      const limit = length;
      const sortColumn = columns[order[0].column].data;
      const sortOrder = order[0].dir;
      const searchValue = search.value;

      const courses = await admin.findWithPagination(limit, offset, sortColumn, sortOrder, columns, searchValue);
      const count = await admin.count();
      const scount = await admin.scount(columns, searchValue);

      res.send({
         statusCode: 200,
          courses: courses,
          draw: draw,
          recordsTotal: count,
          recordsFiltered: scount
      });
  } catch (error) {
      console.error(error);
      responseManagement.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, global.internal_server_error);
  }
};

module.exports.GetCategory = async (req, res) => {
  try {
    const allCourses = await prisma.course.findMany({
      select: {
        id: true,
        category: true,
      },
    });
    const categoryMap = new Map();
    allCourses.forEach((course) => {
      if (!categoryMap.has(course.category)) {
        categoryMap.set(course.category, course.id);
      }
    });
    const uniqueCategories = Array.from(categoryMap, ([category, id]) => ({
      id,
      category,
    }));
    res.status(200).json({ 
      statusCode:200,
      categories: uniqueCategories });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode:500,
      message:error
    });
  }
};
module.exports.fileUploadGet=async(req,res)=>{
  try {
    const fileName=req.params.fileName;
    console.log(fileName)
    const filePath = path.join(__dirname,'..', 'uploads', fileName);
    return res.status(200).sendFile(filePath);
  } catch (error) {
    console.log(error);
    return res.status(500).send({message:error})
    
  }
}
