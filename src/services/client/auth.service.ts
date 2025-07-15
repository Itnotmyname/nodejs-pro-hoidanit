import { compare } from "bcrypt";
import { prisma } from "config/client"
import { ACCOUNT_TYPE } from "config/constant";
import { hashPassword } from "services/user.service";

//Xem bài 104 để hiểu rõ hơn

const isEmailExist = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: { username: email }
    });
    if (user) {
        return true;
    }
    return false;
}

const registerNewUser = async (
    fullName: string,
    email: string,
    password: string,
) => {
    const newPassword = await hashPassword(password);

    const userRole = await prisma.role.findUnique({
        where: { name: "USER" } //Xem bài 104 để hiểu tại sao lại tìm theo role
    })
    if (userRole) {
        await prisma.user.create({
            data: {
                username: email,
                password: newPassword,
                fullName: fullName,
                accountType: ACCOUNT_TYPE.SYSTEM,
                roleId: userRole.id,
            }
        })
    } else {
        throw new Error("User Role không tồn tại.")
    }

}

const getUserWithRoleById = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: { id: +id },
        include: {           //xem bài 114 đây là cú pháp include của prisma hay joint của mySQL để lấy thêm dữ liệu từ bảng nào đó mà mình muốn thêm vào
            role: true
        },
        omit: {   //Cú pháp này của prisma để không muốn hiển thị phần nào của mySQL (table nào) 
            password: true
        },
    });

    // delete user.password; Đây là cú pháp của Javascript có thể là dùng cái này cũng được 
    return user;
}

const getUserSumCart = async (id: string) => {
    const user = await prisma.cart.findUnique({ //Bài 121 phút 11:22 có nói dùng findFirst cũng được 
        where: { userId: +id },
    });

    return user?.sum ?? 0;
}


export { isEmailExist, registerNewUser, getUserWithRoleById, getUserSumCart };