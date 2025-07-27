import { prisma } from "config/client";
import getConnection from "config/database";
import { PrismaClient, Prisma } from '@prisma/client'
import { ACCOUNT_TYPE, TOTAL_ITEMS_PER_PAGE } from "config/constant";
import bcrypt = require('bcrypt');
const saltRounds = 10; //Xem bài 84 để hiểu rõ hơn về bcrypt

const hashPassword = async (plainText: string) => {
    return await bcrypt.hash(plainText, saltRounds);
}

const comparePassword = async (plainText: string, hashPassword: string) => {
    return await bcrypt.compare(plainText, hashPassword);
}

const handleCreateUser = async (
    fullName: string,
    email: string,
    address: string,
    phone: string,
    avatar: string,
    role: string
) => {
    const defaultPassword = await hashPassword("Quangnam2003")
    const newUser = await prisma.user.create({
        data: {
            fullName: fullName,
            username: email,
            address: address,
            password: defaultPassword,
            accountType: ACCOUNT_TYPE.SYSTEM,//BÀI 83
            avatar: avatar, //Lưu tên file ảnh vào database
            phone: phone,
            roleId: +role //dấu + để convert từ string sang number, vì id trong database là kiểu number
        }
    })
    return newUser;
}
const getAllUsers = async (page: number) => {
    const pageSize = TOTAL_ITEMS_PER_PAGE; //Số lượng user hiển thị trên mỗi trang ,xem bài 139 phút 02:30
    const skip = (page - 1) * pageSize; //Tính toán số lượng bản ghi cần bỏ qua dựa trên trang hiện tại
    const users = await prisma.user.findMany({
        skip: skip, //Bỏ qua số lượng bản ghi đã tính toán .Đây chính là Offset trong SQL
        take: pageSize, //Lấy số lượng bản ghi theo kích thước trang .Đây chính là Limit trong SQL
    });
    console.log(getAllUsers);
    return users;

}

const countTotalUserPages = async () => { //Xem bài 139 phút 3
    const pageSize = TOTAL_ITEMS_PER_PAGE; //Số lượng user hiển thị trên mỗi trang ,xem bài 139 phút 02:30
    const totalItems = await prisma.user.count(); //Đếm tổng số bản ghi trong bảng user

    const totalPages = Math.ceil(totalItems / pageSize); //Tính toán tổng số trang dựa trên tổng số bản ghi và kích thước trang và hàm Math.ceil để làm tròn lên
    console.log(totalPages); //In ra tổng số trang để kiểm tra
    return totalPages;
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
const updateUserById = async (id: string, fullName: string, phone: string, role: string, address: string, avatar: string) => {
    const updatedUser = await prisma.user.update({
        where: { id: +id }, //Mẹo dùng +id để convert id từ string sang number(int) chỉ áp dụng cho javascript
        data: {
            fullName: fullName,
            phone: phone,
            roleId: +role, //dấu + để convert từ string sang number, vì id trong database là kiểu number
            address: address,
            ...(avatar !== undefined && { avatar: avatar }) //Kiểm tra nếu avatar không phải là undefined hoặc null thì mới cập nhật
            //Toán tử ... là để copy object { avatar: avatar } khi mà avatar có giá trị, nếu không có thì sẽ không cập nhật trường avatar
        }
    })
    return updatedUser;
}



export { handleCreateUser, getAllUsers, handleDeleteUser, getUserById, updateUserById, getAllRoles, hashPassword, comparePassword, countTotalUserPages };

