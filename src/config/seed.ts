import { prisma } from "config/client";
import e from "express";
import { hashPassword } from "services/user.service";
import { ACCOUNT_TYPE } from "config/constant";

//Tạo data fake cho database ,xem bài 73 NodeJS để hiểu rõ hơn
const initDatabase = async () => {
    const countUser = await prisma.user.count();
    const countRole = await prisma.role.count();
    if (countRole === 0) {
        await prisma.role.createMany({
            data: [
                {
                    name: "ADMIN",
                    description: "Admin thì full quyền",
                }, {
                    name: "USER",
                    description: "User thông thường",
                }
            ]
        });
    }
    if (countUser === 0) {
        const defaultPassword = await hashPassword("Quangnam2003");
        const adminRole = await prisma.role.findFirst({
            where: { name: "ADMIN" }
        });
        if (adminRole) {
            await prisma.user.createMany({
                data: [
                    {
                        fullName: "Hoidanit",
                        username: "hoidanit@gmail.com",
                        password: defaultPassword,
                        accountType: ACCOUNT_TYPE.SYSTEM,
                        roleId: adminRole.id, //Lấy động cái này dựa vào role của admin 
                    },
                    {
                        fullName: "Admin",
                        username: "admin@gmail.com",
                        password: defaultPassword,
                        accountType: ACCOUNT_TYPE.SYSTEM,
                        roleId: adminRole.id, //Lấy động cái này dựa vào role của admin 
                    }
                ]
            });
        }

    }
    if (countUser !== 0 && countRole !== 0) {
        console.log("Database already has data, skipping seeding.");
    }
}
export default initDatabase;