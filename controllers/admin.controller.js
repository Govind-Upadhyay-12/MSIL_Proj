const e = require("express");
const { prisma } = require("../DB/db.config");
const { admin } = require("../repositories/userRepositories");
const { user } = require("../repositories/userRepositories");

module.exports.addCourse = async (req, res) => {
  console.log(req.body);
  console.log("ye h req.body", req.file.filename);
  try {
    const video = await admin.createCourse(req.body, req.file);
    return res
      .status(200)
      .send({ message: "Course have successfully made   " });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.assignCourse = async (req, res) => {
  const { REGION, MSPIN_NO, module_name } = req.body;

  if (!REGION && !MSPIN_NO && !DEALER_NAME) {
    return res
      .status(404)
      .send({ message: "Enter one field to assign a course" });
  }

  if (!module_name) {
    return res.status(404).send({ message: "Enter the course name" });
  }

  try {
    const course = await prisma.course.findFirst({
      where: {
        module_name: module_name,
      },
    });

    if (!course) {
      return res.status(400).json({ message: "Course does not exist" });
    }
    console.log(`Course found: ${course.module_name}`);

    const query = {
      REGION: REGION,
      MSPIN_NO: MSPIN_NO,
    };

    if (REGION) {
      query.REGION = REGION;
    }
    if (MSPIN_NO) {
      query.MSPIN_NO = MSPIN_NO;
    }
    const users = await prisma.user.findMany({ where: query });

    if (users.length === 0) {
      return res
        .status(404)
        .send({ message: "No users found for the given criteria" });
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
        console.log(`Course ${course.id} added to user ${user.id}`);
      } catch (error) {
        console.error("Error in adding course to user:", error);
      }
    }

    return res
      .status(200)
      .json({
        message: `Course assigned successfully to all users in the specified region`,
      });
  } catch (error) {
    console.error(error);
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
    return res.status(200).json({ data: data });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error });
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
      return res.status(200).json({ message: "Login successful" });
    } else {
      return res.status(401).json({ message: "Incorrect password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
module.exports.All_Coures = async (req, res) => {
  try {
    const { start, length, columns, order, search, draw } = req.body;
    const offset = start;
    const limit = length;
    const sortColumn = columns[order[0].column].data;
    const sortOrder = order[0].dir;
    const searchValue = search.value;
    const courses = await admin.findWithPagination(
      limit,
      offset,
      sortColumn + " " + sortOrder,
      columns,
      searchValue,
      {}
    );
    const count = await admin.count({});
    const scount = await adminRepo.scount(columns, searchValue, {});
    res.send(200).send({courses:courses,draw:draw,recordsTotal:count.total,recordsFiltered: scount.total,})
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal error", error);
  }
};
