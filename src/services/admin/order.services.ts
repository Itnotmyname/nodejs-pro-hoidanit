import { prisma } from "config/client";
import { TOTAL_ITEMS_PER_PAGE } from "config/constant";

const getOrderAdmin = async (page: number) => { //Xem bài 128
    const pageSize = TOTAL_ITEMS_PER_PAGE; //Số lượng user hiển thị trên mỗi trang ,xem bài 139 phút 02:30
    const skip = (page - 1) * pageSize; //Tính toán số lượng bản ghi cần bỏ qua dựa trên trang hiện tại
    const orders = await prisma.order.findMany({
        skip: skip, //Bỏ qua số lượng bản ghi đã tính toán .Đây chính là Offset trong SQL
        take: pageSize, //Lấy số lượng bản ghi theo kích thước trang .Đây chính là Limit trong SQL
        include: { user: true } //Lấy thêm người dùng ở đây mục đích để hiển thị người dùng 
    });
    return orders;

}

const countTotalOrderPages = async () => {
    const pageSize = TOTAL_ITEMS_PER_PAGE; //Số lượng product hiển thị trên mỗi trang ,xem bài 139 phút 02:30
    const totalItems = await prisma.order.count(); //Lấy tổng số bản ghi trong bảng product

    const totalPages = Math.ceil(totalItems / pageSize); //Tính toán tổng số trang dựa trên tổng số bản ghi và kích thước trang và hàm Math.ceil để làm tròn lên
    return totalPages;
}

const getOrderDetailAdmin = async (orderId: number) => {
    return await prisma.orderDetail.findMany({
        where: { orderId: orderId },
        include: { product: true }
    });
}

export { getOrderAdmin, getOrderDetailAdmin, countTotalOrderPages }