import { prisma } from "config/client";

const getOrderAdmin = async () => { //Xem bài 128
    return await prisma.order.findMany({
        include: { user: true } //Lấy thêm người dùng ở đây mục đích để hiển thị người dùng 
    });

}

const getOrderDetailAdmin = async (orderId :number) =>{
    return await prisma.orderDetail.findMany({
        where:{orderId},
        include:{product:true}
    });
}

export {getOrderAdmin, getOrderDetailAdmin}