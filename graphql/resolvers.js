import { getSession } from "@auth0/nextjs-auth0";

const getUser = async (req) => {
  const session = await getSession(req);
  if (!session || !session.user) {
    return null;
  }
  return session;
};

export const resolvers = {
  Query: {
    getInjury: async (_, { id }, context) => {
      try {
        const injury = await context.prisma.injury.findUnique({
          where: {
            id,
          },
        });

        if (!injury) {
          return null;
        }

        return injury;
      } catch (error) {
        throw error;
      }
    },
    injuries: async (parent, args, context) => {
      try {
        const injuries = await context.prisma.injuryData.findMany({
          include: {
            reporter: true,
            injuryItem: true,
          },
        });

        return injuries;
      } catch (error) {
        throw error;
      }
    },

    injury: async (_, { id }, context) => {
      try {
        const injuryData = await context.prisma.injuryData.findFirst({
          where: {
            id,
          },
          include: {
            reporter: {
              select: {
                name: true,
                email: true,
              },
            },
            injuryItem: true,
          },
        });

        if (!injuryData) {
          return null;
        }

        return injuryData;
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
          include: {
            injuryList: {
              include: {
                injuryItem: true,
              },
            },
          },
        });

        if (!reporter) {
          return null;
        }

        return reporter;
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    createReporter: async (_, { id, input }, context) => {
      try {
        const { name, email, injuryList = [] } = input;
        const session = await getUser(context.req);
        const userID = session?.user?.sub.split("|")[1];

        if (!id || id !== userID) {
          throw new Error("Reporter ID is required");
        }

        if (!name || typeof name !== "string" || name.length === 0) {
          throw new Error("Reporter name is required");
        }

        const existingReporter = await context.prisma.reporter.findUnique({
          where: {
            id,
          },
          include: {
            injuryList: true,
          },
        });

        if (existingReporter) {
          return existingReporter;
        }

        const reporter = await context.prisma.reporter.create({
          data: {
            id,
            name,
            email,
            injuryList: {
              create: injuryList.map((injury) => ({
                injuryData: {
                  create: {
                    injuryItem: {
                      create: [
                        {
                          bodyMap: injury.bodyMap,
                          bodyPart: injury.bodyPart,
                          description: injury.description,
                          injuryDate: injury.injuryDate,
                        },
                      ],
                    },
                  },
                },
              })),
            },
          },
          include: {
            injuryList: true,
          },
        });

        return reporter;
      } catch (error) {
        throw error;
      }
    },

    updateReporter: async (_, { id, input }, context) => {
      try {
        const session = await getUser(context.req);
        const userID = session?.user?.sub.split("|")[1];

        if (!id || id !== userID) {
          throw new Error("Reporter ID is required");
        }

        const { name, email } = input;

        const existingReporter = await context.prisma.reporter.findUnique({
          where: { id },
          include: {
            injuryList: {
              include: {
                injuryItem: true,
              },
            },
          },
        });

        if (!existingReporter) {
          throw new Error("Reporter not found");
        }

        const updatedReporter = await context.prisma.reporter.update({
          where: { id },
          data: {
            name,
            email,
          },
          include: {
            injuryList: {
              include: {
                injuryItem: true,
              },
            },
          },
        });

        return updatedReporter;
      } catch (error) {
        throw error;
      }
    },
    deleteReporter: async (_, { id }, context) => {
      try {
        const session = await getUser(context.req);
        const userID = session?.user?.sub.split("|")[1];

        if (!id || id !== userID) {
          throw new Error("Reporter ID is required");
        }

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
        throw error;
      }
    },
    createInjury: async (_, { reporterId, input }, context) => {
      try {
        if (!reporterId || typeof reporterId !== "string") {
          throw new Error("You must be logged in to submit a report");
        }

        const { injuryItem } = input;
        // Check if the reporter exists
        const existingReporter = await context.prisma.reporter.findUnique({
          where: {
            id: reporterId,
          },
        });

        if (!existingReporter) {
          throw new Error("Reporter not found");
        }

        const session = await getUser(context.req);
        const userID = session?.user?.sub.split("|")[1];

        if (!reporterId || reporterId !== userID) {
          throw new Error("Reporter ID is required");
        }

        const injuryData = await context.prisma.injuryData.create({
          data: {
            reporter: {
              connect: {
                id: reporterId,
              },
            },
            injuryItem: {
              create: injuryItem.map((injury) => ({
                id: injury.id,
                bodyMap: injury.bodyMap,
                bodyPart: injury.bodyPart,
                description: injury.description,
                injuryDate: injury.injuryDate,
              })),
            },
          },
          include: {
            reporter: true,
          },
        });

        return injuryData;
      } catch (error) {
        throw error;
      }
    },
    updateInjury: async (_, { id, input }, context) => {
      try {
        const { injuryItem } = input;
        if (!id || typeof id !== "string")
          throw new Error("Injury ID is required");

        const existingInjury = await context.prisma.injuryData.findUnique({
          where: { id },
          include: { reporter: true },
        });
        if (!existingInjury) {
          throw new Error("Injury not found");
        }

        const session = await getUser(context.req);
        const userID = session?.user?.sub.split("|")[1];

        if (existingInjury.reporterId !== userID) {
          throw new Error("Cannot update injury for another reporter");
        }

        // Delete all existing injuries
        const deletedInjuries = await context.prisma.injury.deleteMany({
          where: {
            relatedInjuriesId: id,
          },
        });

        // Create new injuries
        const updatedInjuryData = await context.prisma.injuryData.update({
          where: { id },
          data: {
            injuryItem: {
              create: injuryItem.map((newItem) => ({
                bodyMap: newItem.bodyMap,
                bodyPart: newItem.bodyPart,
                description: newItem.description,
                injuryDate: newItem.injuryDate,
              })),
            },
          },
          include: { reporter: true },
        });
        return updatedInjuryData;
      } catch (error) {
        throw error;
      }
    },

    deleteInjury: async (_, { id }, context) => {
      try {
        const existingInjury = await context.prisma.injuryData.findUnique({
          where: {
            id,
          },
        });

        if (!existingInjury) {
          throw new Error("Injury not found");
        }

        const session = await getUser(context.req);
        const userID = session?.user?.sub.split("|")[1];

        if (existingInjury.reporterId !== userID) {
          throw new Error("Cannot delete injury for another reporter");
        }

        const deletedInjury = await context.prisma.injuryData.delete({
          where: {
            id,
          },
        });

        return deletedInjury;
      } catch (error) {
        throw error;
      }
    },
  },
  Reporter: {
    id: (parent) => parent.id,
    name: (parent) => parent.name,
    email: (parent) => parent.email,
    injuryList: (parent) => parent.injuryList,
  },
  InjuryData: {
    id: (parent) => parent.id,
    reporter: async (parent, _, context) => {
      if (!parent.reporterId) {
        throw new Error("Reporter ID is missing in the resolver.");
      }
      const reporter = await context.prisma.reporter.findUnique({
        where: {
          id: parent.reporterId,
        },
      });
      return reporter;
    },
    injuryItem: async (parent, _, context) => {
      const injuries = await context.prisma.injury.findMany({
        where: {
          relatedInjuriesId: parent.id,
        },
      });
      return injuries;
    },
  },

  Injury: {
    id: (parent) => parent.id,
    relatedInjuries: async (parent, _, context) => {
      const relatedInjuries = await context.prisma.injuryData.findUnique({
        where: {
          id: parent.relatedInjuriesId,
        },
      });
      return relatedInjuries;
    },
    bodyMap: (parent) => parent.bodyMap,
    bodyPart: (parent) => parent.bodyPart,
    description: (parent) => parent.description,
    injuryDate: (parent) => parent.injuryDate,
  },
};
