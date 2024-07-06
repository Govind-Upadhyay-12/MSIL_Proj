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
      console.log(condition);
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
      console.log("cndknfdk",data)
      try {
        return await prisma.course.create({
          data: {
            category: data.category,
            module_name: data.module_name,
            videoLink: file.originalname,
            content: data.content,
            duration: data.duration,
          },
        });
      } catch (error) {
        console.error("Error in creating course:", error);
        throw new Error("Failed to create course");
      }
    },
    findCourse: async (condition) => {
      const { title } = condition;
      try {
        return await prisma.course.findFirst({ where: { title: title } });
      } catch (error) {
        console.error("Error in finding course:", error);
        throw new Error("Failed to find course");
      }
    },
    createAdd: async (file) => {
      try {
        const create_adds = await prisma.adds.create({
          data: {
            image: file.path,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    addCourse: async (data) => {
      const { userId, courseId } = data;
      console.log(`userId and courseId are: ${userId} ${courseId}`);
      try {
        await prisma.user.update({
          where: {
            id: data.user.id,
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
    findCourseByCategory: async (data) => {
      const { category } = data;
      try {
        const course_by_category = await prisma.course.findMany({
          where: {
            category: category,
          },
          select: {
            id: true,
            module_name: true,
          },
        });
        if (!course_by_category) {
          throw new Error("no couse available for this category");
        }
          console.log(course_by_category);
        return course_by_category;
      } catch (error) {
        console.log(error);
        throw new Error("Failed to search_based on category");
      }
    },
    Find_All_Courses:async(data)=>{
      try {
        const all_courses=await prisma.course.findMany();
        return all_courses
      } catch (error) {
        console.log(error);
        throw new Error("Failed to search_based on category",error);
        
      }
    },
    findWithPagination: async (limit, offset, sortColumn, sortOrder, columns, searchValue) => {
      let where = {};

      if (searchValue) {
          const searchConditions = columns
              .filter(column => column.searchable && column.name)
              .map(column => ({
                  [column.name]: {
                      contains: searchValue,
                      mode: 'insensitive'
                  }
              }));

          where = {
              OR: searchConditions
          };
      }

      return await prisma.course.findMany({
          where: where,
          orderBy: {
              [sortColumn]: sortOrder
          },
          take: limit,
          skip: offset,
      });
  },

  scount: async (columns, searchValue) => {
      let where = {};

      if (searchValue) {
          const searchConditions = columns
              .filter(column => column.searchable && column.name)
              .map(column => ({
                  [column.name]: {
                      contains: searchValue,
                      mode: 'insensitive'
                  }
              }));

          where = {
              OR: searchConditions
          };
      }

      return await prisma.course.count({
          where: where
      });
  },

  count: async () => {
      return await prisma.course.count();
  },
  findUsersWithPagination: async (limit, offset, sortColumn, sortOrder, columns, searchValue) => {
    let where = {};

    if (searchValue) {
      const searchConditions = columns
        .filter(column => column.searchable && column.name)
        .map(column => ({
          [column.name]: {
            contains: searchValue,
            mode: 'insensitive'
          }
        }));

      where = {
        OR: searchConditions
      };
    }

    return await prisma.user.findMany({
      where: where,
      orderBy: {
        [sortColumn]: sortOrder
      },
      take: limit,
      skip: offset,
      include: {
        courses: true // Include associated courses
      }
    });
  },

  userFilteredCount: async (columns, searchValue) => {
    let where = {};

    if (searchValue) {
      const searchConditions = columns
        .filter(column => column.searchable && column.name)
        .map(column => ({
          [column.name]: {
            contains: searchValue,
            mode: 'insensitive'
          }
        }));

      where = {
        OR: searchConditions
      };
    }

    return await prisma.user.count({
      where: where
    });
  },

  userCount: async () => {
    return await prisma.user.count();
  }
}

};
