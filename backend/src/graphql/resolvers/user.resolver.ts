import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
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
    createUser: async (
      _: any,
      { name, email, username, password, role, authKey }: { name: string; email: string; username?: string; password: string; role: 'ADMIN' | 'CLIENT'; authKey?: string }
    ) => {
      // Verificar se o e-mail já existe
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new Error("Este e-mail já está em uso.");
      }

      // Verificar se a senha tem pelo menos 8 caracteres
      if (password.length < 8) {
        throw new Error("A senha deve ter pelo menos 8 caracteres.");
      }

      // Se não foi passado um username, ele será o próprio e-mail
      if (!username) {
        username = email;
      }

      // Verificar se o username já existe
      const existingUsername = await prisma.user.findUnique({ where: { username } });
      if (existingUsername) {
        throw new Error("Este nome de usuário já está em uso.");
      }

      // Se estiver criando um ADMIN, verificar a chave de autenticação
      if (role === "ADMIN") {
        if (!authKey) {
          throw new Error("É necessário fornecer uma chave de autenticação para criar um ADMIN.");
        }

        // Buscar o ADMIN que está tentando criar outro ADMIN
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

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      return await prisma.user.create({
        data: { name, email, password: hashedPassword, role, username },
      });
    },
    loginUser: async (_: any, { username, password }: { username: string; password: string }) => {
      const user = await prisma.user.findUnique({ where: { username } });
      if (!user) {
        throw new Error("Usuário não encontrado.");
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        throw new Error("Senha incorreta.");
      }

      let authKey = null;
      let authKeyExpiresAt = null;

      // Se for ADMIN, gerar uma chave temporária válida por 5 minutos
      if (user.role === "ADMIN") {
        authKey = randomBytes(16).toString("hex"); // Gera uma chave aleatória
        authKeyExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // Expira em 5 minutos

        // Atualizar o usuário com a chave temporária
        await prisma.user.update({
          where: { id: user.id },
          data: { authKey, authKeyExpiresAt },
        });
      }

      return {
        user,
        message: user.role === "ADMIN" ? `Chave de autenticação gerada` : "Login bem-sucedido!",
        key: authKey
      };
    },
    updateUser: async (_: any, { id, name, email, role, currentPassword, newPassword, username}: 
      { id: string; name?: string; email?: string; role?: 'ADMIN' | 'CLIENT'; currentPassword: string; newPassword?: string; username?: String;}) => {

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
