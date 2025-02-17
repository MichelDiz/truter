import bcrypt from 'bcryptjs';
import prisma from '../../config/db';

export const resolvers = {
  Query: {
    users: async () => {
      return await prisma.user.findMany();
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
