const e = require("express");
const { prisma } = require("../DB/db.config");
const { admin } = require("../repositories/userRepositories");
const { user } = require("../repositories/userRepositories");
const csvParser = require('csv-parser');
const fs = require('fs');

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
      return res.status(500).json({statusCode:500,message:error})
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
module.exports.initialize_table=async(req,res)=>{
  const { courseId, numProblems, numComponents } = req.body;
  try {
    const maxProblemId = await prisma.problem.findFirst({
      where: { course_id: courseId },
      orderBy: { id: 'desc' }
    });
    const maxComponentId = await prisma.component.findFirst({
      where: { course_id: courseId },
      orderBy: { id: 'desc' }
    });

    const startProblemId = maxProblemId ? maxProblemId.id + 1 : 1;
    const startComponentId = maxComponentId ? maxComponentId.id + 1 : 1;

    const problems = await Promise.all(
      Array.from({ length: numProblems }).map((_, index) =>
        prisma.problem.create({
          data: {
            id: startProblemId + index,
            name: `Problem ${index + 1}`,
            description: 'Description',
            course: { connect: { id: courseId } }
          }
        })
      )
    );

    const components = await Promise.all(
      Array.from({ length: numComponents }).map((_, index) =>
        prisma.component.create({
          data: {
            id: startComponentId + index,
            name: `Component ${index + 1}`,
            description: 'Description',
            course: { connect: { id: courseId } }
          }
        })
      )
    );

    res.json({ problems, components });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while initializing the table.' });
  }
}


module.exports.map_component= async (req, res) => {
  const { mappings } = req.body;

  try {
    const componentProblems = await Promise.all(
      mappings.map((mapping) =>
        prisma.componentProblem.create({
          data: {
            problem: { connect: { id: mapping.problemId } },
            component: { connect: { id: mapping.componentId } }
          },
          include: {
            problem: true,
            component: true
          }
        })
      )
    );

    const tableData = componentProblems.map(cp => ({
      ProblemName: cp.problem.name,
      ComponentName: cp.component.name
    }));

    res.json({ tableData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while mapping components to problems.' });
  }
}
module.exports.AddCourse_csv=async(req,res)=>{
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).send('No file uploaded.');
    }
    const results = [];

  fs.createReadStream(file.path)
  .pipe(csvParser())
  .on('data', (data) => results.push(data))
  .on('end', async () => {
    try {
      for (const course of results) {
        await prisma.course.create({
          data: {
            category: course.category,
            module_name: course.module_name,
            content: course.content,
            duration: course.duration,
            created_at: new Date(),
            updated_at: new Date(),
          },
        });
      }
    return res.status(200).json({statusCode:200,
      message:"courses added successfully"
    })
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while adding courses.');
    } finally {
      fs.unlinkSync(file.path);
    }
  });
    
  } catch (error) {
    console.log(error);
    return res.status(500).send({error:error})
    
  }
}

module.exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).send('Course ID is required');
    }

    const courseId = parseInt(id);
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).send('Course not found');
    }

    await prisma.course.delete({
      where: { id: courseId },
    });

    res.status(200).json({statusCode:200,message:"courses delete successfully"});
  } catch (error) {
    console.error(error);
    res.status(500).send({statusCode:500,message:error});
  }
};

module.exports.All_Users_Courses = async (req, res) => {

  try {
    const { start, length, columns, order, search, draw } = req.body;

    const offset = start;
    const limit = length;
    const sortColumn = columns[order[0].column].data;
    const sortOrder = order[0].dir;
    const searchValue = search.value;

    const users = await admin.findUsersWithPagination(limit, offset, sortColumn, sortOrder, columns, searchValue);
    const count = await admin.userCount();
    const filteredCount = await admin.userFilteredCount(columns, searchValue);

    res.send({
      statusCode: 200,
      users: users,
      draw: draw,
      recordsTotal: count,
      recordsFiltered: filteredCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching users');
  }
};

module.exports.Assigning_table = async (req, res) => {
  try {
    const { courseId, problems, components } = req.body;

    if (!courseId || typeof problems !== 'number' || typeof components !== 'number') {
      return res.status(400).json({ error: 'Invalid request body. Ensure courseId, problems, and components are provided and are numbers.' });
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const createdProblems = await Promise.all(
      Array.from({ length: problems }).map((_, index) =>
        prisma.problem.create({
          data: {
            name: `Problem ${index + 1}`,
            description: `Description for Problem ${index + 1}`,
            course: { connect: { id: courseId } },
          },
        })
      )
    );

    const createdComponents = await Promise.all(
      Array.from({ length: components }).map((_, index) =>
        prisma.component.create({
          data: {
            name: `Component ${index + 1}`,
            description: `Description for Component ${index + 1}`,
            course: { connect: { id: courseId } },
          },
        })
      )
    );

    res.json({ problems: createdProblems, components: createdComponents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while initializing the table.' });
  }
};


module.exports.MapComponent = async (req, res) => {
  const { courseId, mappings } = req.body;

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        problems: true,
        components: true,
      },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const problemMap = new Map(course.problems.map((problem, index) => [problem.id, index]));
    const componentMap = new Map(course.components.map((component, index) => [component.id, index]));

    const componentProblems = await Promise.all(
      mappings.map(async mapping => {
        const problemIndex = problemMap.get(mapping.problemId);
        const componentIndex = componentMap.get(mapping.componentId);

        if (problemIndex === undefined || componentIndex === undefined) {
          throw new Error(`Invalid mapping: problemId ${mapping.problemId} or componentId ${mapping.componentId} not found`);
        }

        const problemId = course.problems[problemIndex].id;
        const componentId = course.components[componentIndex].id;

        const createdComponentProblem = await prisma.componentProblem.create({
          data: {
            problem: { connect: { id: problemId } },
            component: { connect: { id: componentId } },
          },
          include: {
            problem: true,
            component: true,
          },
        });

        return {
          ProblemId: createdComponentProblem.problem.id,
          ComponentId: createdComponentProblem.component.id,
        };
      })
    );

    res.json({ tableData: componentProblems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while mapping components to problems.' });
  }
};
module.exports.LogOut = async (req, res) => {
  try {
    return res.status(200).json({ statusCode:200,message: 'Logged out successfully. Please remove the token from local storage.' });
  } catch (error) {
    console.error(error);
   return res.status(500).json({statusCode:500,error: 'An error occurred while logging out.' });
  }
};
