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
    createUser: async (_: any, { name, email, password, role }: { name: string; email: string; password: string; role: 'ADMIN' | 'CLIENT' }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      return await prisma.user.create({
        data: { name, email, password: hashedPassword, role },
      });
    },

    updateUser: async (_: any, { id, name, email, role, currentPassword, newPassword }: 
      { id: string; name?: string; email?: string; role?: 'ADMIN' | 'CLIENT'; currentPassword: string; newPassword?: string }) => {

      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) {
        throw new Error("Senha atual incorreta");
      }

      const updateData: any = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (role) updateData.role = role;

      if (newPassword) {
        updateData.password = await bcrypt.hash(newPassword, 10);
      }

      return await prisma.user.update({
        where: { id },
        data: updateData,
      });
    },
  },
};
