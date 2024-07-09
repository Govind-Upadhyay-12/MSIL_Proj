const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const logger = require("morgan");
const bodyParser = require("body-parser");
const { connectPostgresql } = require("./DB/db.config.js");
const config = require("./dbconfig.js");
const path = require('path');
const app = express();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


dotenv.config(); 
connectPostgresql();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

app.get('/', (req, res) => {
  res.send("server is running on AWS");
});

app.post('/initialize-table', async (req, res) => {
  const { courseId, problems, components } = req.body;

  if (!courseId || typeof problems !== 'number' || typeof components !== 'number') {
    return res.status(400).json({ error: 'Invalid request body. Ensure courseId, problems, and components are provided and are numbers.' });
  }

  try {
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
});

app.post('/map-components-problems', async (req, res) => {
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

    const validProblemIds = new Set(course.problems.map(problem => problem.id));
    const validComponentIds = new Set(course.components.map(component => component.id));

    const componentProblems = await Promise.all(
      mappings.map(mapping => {
        if (!validProblemIds.has(mapping.problemId) || !validComponentIds.has(mapping.componentId)) {
          throw new Error(`Invalid mapping: problemId ${mapping.problemId} or componentId ${mapping.componentId} not found`);
        }
        return prisma.componentProblem.create({
          data: {
            problem: { connect: { id: mapping.problemId } },
            component: { connect: { id: mapping.componentId } },
          },
          include: {
            problem: true,
            component: true,
          },
        });
      })
    );

    const tableData = componentProblems.map(cp => ({
      ProblemId: cp.problem.id,
      ComponentId: cp.component.id,
    }));

    res.json({ tableData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while mapping components to problems.' });
  }
});


app.use("/admin", express.static(path.join(__dirname, "./admin/dist/admin")));
app.get(/\/admin\/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "./admin/dist/admin/index.html"));
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(require("./routes/index.js"));

app.listen(8080, () => {
  console.log(`Server is running on port ${8080}`);
});
