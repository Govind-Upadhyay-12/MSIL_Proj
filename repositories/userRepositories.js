const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = {
  user: {
    findOne: async (condition) => {
      try {
        return await prisma.user.findFirst({ where: condition });
      } catch (error) {
        console.error("Error in finding user:", error);
        throw new Error("Failed to find user");
      }
    },
    getCourses: async (condition) => {
        console.log(condition)
        const parsedUserId = Number(condition); 
        try {
          const user = await prisma.user.findFirst({
            where: {
              id: parsedUserId,
            },
            include: {
              courses: true,
            },   
          });
          if (!user) {
            throw new Error("User not found");
          }
          return user.courses; 
        } catch (error) {
          console.error("Error in getting courses:", error);
          throw new Error("Failed to get courses");
        }  
      },
      
      
  },
  admin: {
    createCourse: async (data, file) => {
      try {
        return await prisma.course.create({
          data: {
            title: data.title,
            videoLink: file.path,
            content: data.content,
          },
        });
      } catch (error) {
        console.error("Error in creating course:", error);
        throw new Error("Failed to create course");
      }
    },
    findCourse: async (condition) => {
         const {title}=condition;
        try {

          return await prisma.course.findFirst({ where: { title: title } });
        } catch (error) {
          console.error("Error in finding course:", error);
          throw new Error("Failed to find course");
        }
      },
    addCourse: async (data) => {
      const { userId, courseId } = data;
      console.log(`userId and courseId are: ${userId} ${courseId}`);
      try {
        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            courses: {
              connect: { id: courseId },
            },
          },
        });
        console.log(`Course ${courseId} added to user ${userId}`);
      } catch (error) {
        console.error("Error in adding course to user:", error);
        throw new Error("Failed to add course to user");
      }
    },
  },
};
