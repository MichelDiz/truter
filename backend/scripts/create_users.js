import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createUsers() {
  console.log("📌 Criando usuários fictícios...");

  const users = [
    { name: "Alice", username: "alice", email: "alice@email.com", password: "12345678", role: "CLIENT" },
    { name: "Bob", username: "bob", email: "bob@email.com", password: "12345678", role: "CLIENT" },
    { name: "Charlie", username: "charlie", email: "charlie@email.com", password: "12345678", role: "CLIENT" },
    { name: "David", username: "david", email: "david@email.com", password: "12345678", role: "CLIENT" },
    { name: "Eve", username: "eve", email: "eve@email.com", password: "12345678", role: "CLIENT" },
    { name: "Frank", username: "frank", email: "frank@email.com", password: "12345678", role: "CLIENT" },
    { name: "Grace", username: "grace", email: "grace@email.com", password: "12345678", role: "CLIENT" },
    { name: "Hank", username: "hank", email: "hank@email.com", password: "12345678", role: "CLIENT" },
    { name: "Ivy", username: "ivy", email: "ivy@email.com", password: "12345678", role: "CLIENT" },
    { name: "Jack", username: "jack", email: "jack@email.com", password: "12345678", role: "CLIENT" }
  ];

  for (const user of users) {
    const existingUser = await prisma.user.findUnique({ where: { email: user.email } });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await prisma.user.create({
        data: {
          name: user.name,
          username: user.username,
          email: user.email,
          password: hashedPassword,
          role: user.role,
        },
      });
      console.log(`✅ Usuário criado: ${user.username}`);
    } else {
      console.log(`⚠️ Usuário já existe: ${user.username}, pulando...`);
    }
  }

  console.log("✅ Todos usuários fictícios foram criados!");
  await prisma.$disconnect();
}

createUsers().catch((e) => {
  console.error("Erro ao criar usuários:", e);
});
