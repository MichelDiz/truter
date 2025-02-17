import bcrypt from 'bcryptjs';
import prisma from '../../config/db';

export const resolvers = {
  Query: {
    users: async () => {
      return await prisma.user.findMany();
    },
    userById: async (_: any, { id }: { id: string }) => {
      return await prisma.user.findUnique({ where: { id } });
    },
    userByEmail: async (_: any, { email }: { email: string }) => {
      return await prisma.user.findUnique({ where: { email } });
    },
    userByName: async (_: any, { name }: { name: string }) => {
      return await prisma.user.findMany({ where: { name } });
    },
    usersByRole: async (_: any, { role }: { role: 'ADMIN' | 'CLIENT' }) => {
      return await prisma.user.findMany({ where: { role } });
    },
  },
  Mutation: {
    createUser: async (_: any, { name, email, password, role }: 
      { name: string; email: string; password: string; role: 'ADMIN' | 'CLIENT' }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      return await prisma.user.create({
        data: { name, email, password: hashedPassword, role },
      });
    },
  },
};
