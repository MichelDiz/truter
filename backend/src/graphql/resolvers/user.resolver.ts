import prisma from '../../config/db';

export const resolvers = {
  Query: {
    users: async () => {
      return await prisma.user.findMany();
    },
  },
  Mutation: {
    createUser: async (_: any, { name, email }: { name: string; email: string }) => {
      return await prisma.user.create({ data: { name, email } });
    },
  },
};
