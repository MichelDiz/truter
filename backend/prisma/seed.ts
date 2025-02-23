import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const superAdminEmail = "superadmin@email.com";
    const superAdminUsername = "superadmin";

    const hashedPassword = await bcrypt.hash("superadminpassword", 10);

    await prisma.user.create({
        data: {
            name: "Super Admin",
            email: superAdminEmail,
            username: superAdminUsername,
            password: hashedPassword,
            role: "ADMIN",
        },
    });

    console.log("✅ Super Admin criado com sucesso!");

}

main()
    .catch((e) => {
        console.error("Erro ao rodar o seed:", e);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log("Seed finalizado");
    });
