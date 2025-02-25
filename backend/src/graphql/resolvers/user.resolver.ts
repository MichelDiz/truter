import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import prisma from '../../config/db';
import { User, CreateUserInput, LoginUserInput, UpdateUserInput } from '../../models/user.interface';

export const resolvers = {
  Query: {
    users: async (): Promise<User[]> => {
      return await prisma.user.findMany();
    },
    userById: async (_: unknown, { id }: { id: string }): Promise<User | null> => {
      return await prisma.user.findUnique({ where: { id } });
    },
    userByEmail: async (_: unknown, { email }: { email: string }): Promise<User | null> => {
      return await prisma.user.findUnique({ where: { email } });
    },
    userByName: async (_: unknown, { name }: { name: string }): Promise<User[]> => {
      return await prisma.user.findMany({ where: { name } });
    },
    usersByRole: async (_: unknown, { role }: { role: 'ADMIN' | 'CLIENT' }): Promise<User[]> => {
      return await prisma.user.findMany({ where: { role } });
    },
  },
  Mutation: {
    createUser: async (_: unknown, args: CreateUserInput): Promise<User> => {
      const { name, email, username, password, role, authKey } = args;

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) throw new Error("Este e-mail já está em uso.");

      if (password.length < 8) throw new Error("A senha deve ter pelo menos 8 caracteres.");

      const finalUsername = username || email;

      const existingUsername = await prisma.user.findUnique({ where: { username: finalUsername } });
      if (existingUsername) throw new Error("Este nome de usuário já está em uso.");

      if (role === "ADMIN") {
        if (!authKey) throw new Error("É necessário fornecer uma chave de autenticação para criar um ADMIN.");

        const adminUser = await prisma.user.findFirst({ where: { authKey } });

        if (!adminUser || adminUser.authKeyExpiresAt! < new Date()) {
          throw new Error("Chave de autenticação inválida ou expirada.");
        }

        // Invalida a chave após o uso
        await prisma.user.update({
          where: { id: adminUser.id },
          data: { authKey: null, authKeyExpiresAt: null },
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      return await prisma.user.create({
        data: { name, email, password: hashedPassword, role, username: finalUsername },
      });
    },

    loginUser: async (_: unknown, args: LoginUserInput) => {
      const { username, password } = args;

      const user = await prisma.user.findUnique({ where: { username } });
      if (!user) throw new Error("Usuário não encontrado.");

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) throw new Error("Senha incorreta.");

      let authKey: string | null = null;
      let authKeyExpiresAt: Date | null = null;

      if (user.role === "ADMIN") {
        authKey = randomBytes(16).toString("hex");
        authKeyExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await prisma.user.update({
          where: { id: user.id },
          data: { authKey, authKeyExpiresAt },
        });
      }

      return {
        user,
        message: user.role === "ADMIN" ? `Chave de autenticação gerada` : "Login bem-sucedido!",
        key: authKey,
      };
    },

    updateUser: async (_: unknown, args: UpdateUserInput): Promise<User> => {
      const { id, name, email, role, currentPassword, newPassword, username } = args;

      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) throw new Error("Usuário não encontrado");

      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) throw new Error("Senha atual incorreta");

      const updateData: Partial<User> = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (role) updateData.role = role;
      if (username) updateData.username = username;

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
