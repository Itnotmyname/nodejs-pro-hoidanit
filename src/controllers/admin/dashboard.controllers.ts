import exp from "constants";
import { Request, Response } from "express";
import { getDashboardInfo } from "services/admin/dashboard.service";
import { getOrderAdmin, getOrderDetailAdmin } from "services/admin/order.services";
import { getProductList } from "services/admin/product.service";
import { countTotalUserPages, getAllUsers } from "services/user.service";

const getDashboardPage = async (req: Request, res: Response) => {
    const info = await getDashboardInfo(); //Xem bài 130 phút 3:20 để hiểu tại sao lại có cái middleware isAdmin .Xem tiếp bài 116 từ phút thứ 4 để hiểu tại sao phải tối ưu middleware kiểu khác
    return res.render("admin/dashboard/show.ejs", {
        info: info, //Đây là truyền qua biến function info
    });
}

const getAdminUserPage = async (req: Request, res: Response) => {
    const { page } = req.query; //Xem bài 138 phút 1:35 để hiểu

    let currentPage = page ? +page : 1; //Nếu có page thì convert sang number, nếu không thì mặc định là 1
    if (currentPage <= 0) {
        currentPage = 1; //Nếu page nhỏ hơn hoặc bằng 0 thì mặc định là 1 ,điều này giúp không thể lấy page âm hoặc page 0
    }

    const users = await getAllUsers(currentPage);
    const totalPages = await countTotalUserPages(); //Xem bài 139 phút 3 để hiểu
    return res.render("admin/user/show.ejs", {
        users: users,   //Nếu key:value giống nhau thì có thể viết ngắn gọn là users
        totalPages: +totalPages, //Truyền vào view để hiển thị số trang
        page: +page, //Truyền vào view để hiển thị số trang hiện tại
    });
}

const getAdminProductPage = async (req: Request, res: Response) => {
    const products = await getProductList();
    return res.render("admin/product/show.ejs", { products });
}

const getAdminOrderPage = async (req: Request, res: Response) => {

    const orders = await getOrderAdmin();
    return res.render("admin/order/show.ejs", {
        orders: orders,  //Xem baì 128 phút 2:30 ,đây là truyền qua biến function order
    });
}

const getAdminOrderDetailPage = async (req: Request, res: Response) => {
    const { id } = req.params;

    const orderDetails = await getOrderDetailAdmin(+id);

    return res.render("admin/order/detail.ejs", {
        orderDetails: orderDetails,
        id: id,
    })

}

export { getDashboardPage, getAdminUserPage, getAdminProductPage, getAdminOrderPage, getAdminOrderDetailPage };
