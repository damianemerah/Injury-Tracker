export const resolvers = {
  Query: {
    injuries: async (parent, args, context) => {
      try {
        const injuries = await context.prisma.injury.findMany({});

        return injuries;
      } catch (error) {
        throw error;
      }
    },

    injury: async (_, { reporterId }, context) => {
      try {
        const injury = await context.prisma.injury.findFirst({
          where: {
            reporterId,
          },
        });

        if (!injury) {
          throw new Error("Injury not found");
        }

        return injury;
      } catch (error) {
        throw error;
      }
    },

    reporter: async (_, { id }, context) => {
      try {
        const reporter = await context.prisma.reporter.findUnique({
          where: {
            id,
          },
        });

        if (!reporter) {
          throw new Error("Reporter not found");
        }

        return reporter;
      } catch (error) {
        throw error;
      }
    },
    reporters: async (_, __, context) => {
      try {
        const reporters = await context.prisma.reporter.findMany({
          include: {
            injuries: true,
          },
        });

        return reporters;
      } catch (error) {
        throw error;
      }
    },

    parts: async (_, { filter }, context) => {
      try {
        if (filter && Array.isArray(filter)) {
          return await context.prisma.injury.findMany({
            where: {
              parts: {
                hasSome: [...filter],
              },
            },
          });
        }

        throw new Error("Filter is required");
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    createReporter: async (_, { id, input }, context) => {
      try {
        if (!id || typeof id !== "string")
          throw new Error("Reporter ID is required");
        if (!input.name || typeof input.name !== "string")
          throw new Error("Reporter name is required");

        const existingReporter = await context.prisma.reporter.findUnique({
          where: {
            id,
          },
          include: {
            injuries: true,
          },
        });

        if (existingReporter) {
          throw new Error("Reporter already exists");
        }

        const { name, email, injuries = [] } = input;

        const reporter = await context.prisma.reporter.create({
          data: {
            id,
            name,
            email,
            injuries: { create: injuries },
          },
        });

        if (!reporter) {
          throw new Error("Failed to create reporter");
        }

        return reporter;
      } catch (error) {
        throw error;
      }
    },
    updateReporter: async (_, { id, input }, context) => {
      try {
        if (!id || typeof id !== "string")
          throw new Error("Reporter ID is required");

        const { name, email, injuries = [] } = input;

        const existingReporter = await context.prisma.reporter.findUnique({
          where: {
            id,
          },
          include: {
            injuries: true,
          },
        });

        if (!existingReporter) {
          throw new Error("Reporter not found");
        }

        const updatedReporter = await context.prisma.reporter.update(
          {
            where: {
              id,
            },
            data: {
              name,
              email,
              injuries: { push: injuries },
            },
          },
          {
            include: {
              injuries: true,
            },
          }
        );

        if (!updatedReporter) {
          throw new Error("Failed to update reporter");
        }

        return updatedReporter;
      } catch (error) {
        console.error("Error updating reporter:", error);
        throw error;
      }
    },
    deleteReporter: async (_, { id }, context) => {
      try {
        if (!id) throw new Error("Reporter ID is required");
        const deletedReporter = await context.prisma.reporter.delete({
          where: {
            id,
          },
        });
        if (!deletedReporter) {
          throw new Error("Failed to delete reporter");
        }
        return deletedReporter;
      } catch (error) {
        console.log("Error deleting reporter:", error);
        throw error;
      }
    },
    createInjury: async (_, { reporterId, input }, context) => {
      try {
        const { bodyMap, parts } = input;

        if (!reporterId) throw new Error("Reporter ID is required");
        if (!bodyMap || typeof bodyMap !== "string")
          throw new Error("Body map is required");
        if (!parts || !Array.isArray(parts) || parts.length === 0)
          throw new Error("Parts are required");

        const existingReporter = await context.prisma.reporter.findUnique({
          where: {
            id: reporterId,
          },
        });

        if (!existingReporter) {
          throw new Error("Reporter not found");
        }

        const injury = await context.prisma.injury.create({
          data: {
            bodyMap,
            parts,
            reporter: {
              connect: {
                id: reporterId,
              },
            },
          },
        });

        if (!injury) {
          throw new Error("Failed to create injury");
        }

        return injury;
      } catch (error) {
        console.log("Error creating injury:", error);
        throw error;
      }
    },
    updateInjury: async (_, { id, input }, context) => {
      try {
        const { bodyMap, parts } = input;

        if (!id || typeof id !== "string")
          throw new Error("Injury ID is required");
        if (!bodyMap || typeof bodyMap !== "string")
          throw new Error("Body map is required");
        if (!parts || !Array.isArray(parts) || parts.length === 0)
          throw new Error("Parts are required");

        const injury = await context.prisma.injury.update({
          where: {
            id,
          },
          data: {
            bodyMap,
            parts,
          },
        });

        return injury;
      } catch (error) {
        console.log("Error updating injury:", error);
        throw error;
      }
    },
    deleteInjury: async (_, { id }, context) => {
      try {
        const deletedInjury = await context.prisma.injury.delete({
          where: {
            id,
          },
        });

        if (!deletedInjury) {
          throw new Error("Failed to delete injury");
        }

        return deletedInjury;
      } catch (error) {
        console.log("Error deleting injury:", error);
        throw error;
      }
    },
  },
  Reporter: {
    id: (parent) => parent.id,
    name: (parent) => parent.name,
    email: (parent) => parent.email,
    injuries: async (parent, _, context) => {
      const injuries = await context.prisma.injury.findMany({
        where: {
          reporterId: parent.id,
        },
      });
      return injuries;
    },
  },

  Injury: {
    id: (parent) => parent.id,
    reporter: async (parent, _, context) => {
      const reporter = await context.prisma.reporter.findUnique({
        where: {
          id: parent.reporterId,
        },
      });
      return reporter;
    },
    bodyMap: (parent) => parent.bodyMap,
    parts: (parent) => parent.parts,
  },
};
