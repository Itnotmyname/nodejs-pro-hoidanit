import exp from "constants";
import { Request, Response } from "express";
import { getOrderAdmin, getOrderDetailAdmin } from "services/admin/order.services";
import { getProductList } from "services/admin/product.service";
import { getAllUsers } from "services/user.service";

const getDashboardPage = async (req: Request, res: Response) => {

    return res.render("admin/dashboard/show.ejs");
}

const getAdminUserPage = async (req: Request, res: Response) => {
    const users = await getAllUsers();
    return res.render("admin/user/show.ejs", {
        users: users,   //Nếu key:value giống nhau thì có thể viết ngắn gọn là users
    });
}

const getAdminProductPage = async (req: Request, res: Response) => {
const products= await getProductList();
    return res.render("admin/product/show.ejs",{products});
}

const getAdminOrderPage = async (req: Request, res: Response) => {
 
    const orders = await getOrderAdmin();
    return res.render("admin/order/show.ejs",{
        orders:orders,  //Xem baì 128 phút 2:30 ,đây là truyền qua biến function order
    });
}

const getAdminOrderDetailPage = async(req:Request, res:Response) =>{
    const {id}=req.params;

    const orderDetails = await getOrderDetailAdmin(+id);

    return res.render("admin/order/detail.ejs",{
        orderDetails:orderDetails,
        id:id,
    })

}

export { getDashboardPage, getAdminUserPage, getAdminProductPage, getAdminOrderPage, getAdminOrderDetailPage };
