


import { prisma } from "config/client";
import { comparePassword } from "services/user.service";
import jwt from 'jsonwebtoken';
import "dotenv/config"

const handleGetAllUser = async () => {
    return await prisma.user.findMany();
}

const handleGetUserById = async (id: number) => {
    return await prisma.user.findUnique({
        where: { id }
    });
}

const handleUpdateUserById = async (id: number,
    fullName: string, address: string, phone: string) => {
    return await prisma.user.update({
        where: { id },
        data: {
            fullName,
            address,
            phone
        }
    });
}

const handleDeleteUserById = async (id: number) => {
    return await prisma.user.delete({
        where: { id },
    });
}

const handleUserLogin = async (username: string, password: string) => {
    const user = await prisma.user.findUnique({ //Xem bài 107 để biết lí do dùng Unique
        where: { username: username },
        include: { role: true }, //Lấy thêm thông tin thuộc tính bảng roles 
    })
    if (!user) {
        //throw error
        throw new Error(`Username:${username} not found`);

        //Xem bài 107 để hiểu rõ tại sao lại có false ở trên dòng 52
    }

    //compare password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        throw new Error(`Invalid password`);
    }

    //Có user login => định nghĩa access token Xem bài 174 phút 8
    const payload = {
        id: user.id,
        username: user.username,
        roleId: user.roleId,
        role: user.role,
        accountType: user.accountType,
        avatar: user.avatar,
    }
    const secret = process.env.JWT_SECRET;
    const expiresIn: any = process.env.JWT_EXPIRES_IN;

    const access_token = jwt.sign(payload, secret, {
        expiresIn: expiresIn //Xem bài 175 phút 07:10
    });
    return access_token;
}

export { handleGetAllUser, handleGetUserById, handleUpdateUserById, handleDeleteUserById, handleUserLogin };