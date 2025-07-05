import { prisma } from "config/client";
import e from "express";

//Tạo data fake cho database ,xem bài 73 NodeJS để hiểu rõ hơn
const initDatabase = async () => {
    const countUser = await prisma.user.count();
    const countRole = await prisma.role.count();
    if (countUser === 0) {
        await prisma.user.createMany({
            data: [
                {
                    username: "hoidanit@gmail.com",
                    password: "123456",
                    accountType: "SYSTEM",
                },
                {
                    username: "admin@gmail.com",
                    password: "123456",
                    accountType: "SYSTEM",
                }
            ]
        });
    } else if (countRole === 0) {
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
    else {
        console.log("Database already has data, skipping seeding.");
    }
}
export default initDatabase;