import { prisma } from "config/client";
import getConnection from "config/database";
import { PrismaClient, Prisma } from '@prisma/client'

const handleCreateUser = async (
    fullName: string,
    email: string,
    address: string) => {


    const newUser = await prisma.user.create({
        data: {
            fullName: fullName,
            username: email,
            address: address,
            password: "",
            accountType: "",
        }
    })
    return newUser;
}
const getAllUsers = async () => {
    const users = await prisma.user.findMany();
    return users;

}

const getAllRoles = async () => {
    const roles = await prisma.role.findMany();
    return roles;

}

const handleDeleteUser = async (id: string) => {
    const result = await prisma.user.delete({
        where: { id: +id }
    })
    return result;
}
const getUserById = async (id: string) => {
    const user = prisma.user.findUnique({ where: { id: +id } });
    return user;
}

const updateUserById = async (id: string, email: string, address: string, fullName: string) => {
    const updatedUser = await prisma.user.update({
        where: { id: +id }, //Mẹo dùng +id để convert id từ string sang number(int) chỉ áp dụng cho javascript
        data: {
            fullName: fullName,
            username: email,
            address: address,
            password: "",
            accountType: "",
        }
    })
    return updatedUser;
}

export { handleCreateUser, getAllUsers, handleDeleteUser, getUserById, updateUserById, getAllRoles };

