import { Request, Response } from "express";
import { countTotalProductClientPages, getProducts } from "services/client/item.service";
import { handleCreateUser, getAllUsers, handleDeleteUser, getUserById, updateUserById, getAllRoles } from "services/user.service";

const getHomePage = async (req: Request, res: Response) => {
    const { page } = req.query;//Xem bài 136 phút 3:50 để hiểu và 141 phút 3:27


    let currentPage = page ? +page : 1; //Nếu có page thì convert sang number, nếu không thì mặc định là 1
    if (currentPage <= 0) {
        currentPage = 1; //Nếu page nhỏ hơn hoặc bằng 0 thì mặc định là 1 ,điều này giúp không thể lấy page âm hoặc page 0
    }

    const products = await getProducts(currentPage, 8);
    const totalPages = await countTotalProductClientPages(8); //Xem bài 141 phút 3:32 để hiểu
    return res.render("client/home/show.ejs", {
        products: products,
        totalPages: +totalPages, //Truyền vào view để hiển thị số trang
        page: +currentPage, //Truyền vào view để hiển thị số trang
    });
}

const getProductFilterPage = async (req: Request, res: Response) => {
    const { page } = req.query;

    let currentPage = page ? +page : 1; //Nếu có page thì convert sang number, nếu không thì mặc định là 1
    if (currentPage <= 0) {
        currentPage = 1; //Nếu page nhỏ hơn hoặc bằng 0 thì mặc định là 1 ,điều này giúp không thể lấy page âm hoặc page 0
    }

    const products = await getProducts(currentPage, 6);
    const totalPages = await countTotalProductClientPages(6); //Xem bài 141 phút 05:00 để hiểu
    return res.render("client/product/filter.ejs", {
        products: products,
        totalPages: +totalPages, //Truyền vào view để hiển thị số trang
        page: +currentPage, //Truyền vào view để hiển thị số trang
    });
}

const getCreateUserPage = async (req: Request, res: Response) => {
    const roles = await getAllRoles();//Lấy tất cả các role từ database
    return res.render("admin/user/create.ejs", {
        roles: roles,//Truyền vào view để hiển thị ra các role
    });//xem bài 77 nodejs để hiểu rõ hơn về cách render view
}

const postCreateUser = async (req: Request, res: Response) => {

    //object destructuring
    const { fullName, username, phone, role, address } = req.body;
    const file = req.file; //Lấy file từ request, nếu không có do chưa update file thì sẽ là undefined hay null
    const avatar = file?.filename ?? null;//Toán tử ? sẽ kiểm tra xem file có tồn tại hay không, nếu có thì lấy tên file, nếu không thì sẽ là undefined và ?? là để giá trị default nếu file không tồn tại thì sẽ là null

    //handle create user
    await handleCreateUser(fullName, username, address, phone, avatar, role);//Lấy động người dùng ,hàm await sẽ phải cho hàm này chạy xong đã rồi mới return 

    return res.redirect("/admin/user");//Lấy được thành công thì sẽ redirect về trang chủ 
}

const postDeleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    await handleDeleteUser(id);
    return res.redirect("/admin/user");
}

const getViewUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    //get user by id (lấy user thông qua id rồi truyền vào view-users)
    const user = await getUserById(id);
    const roles = await getAllRoles();
    return res.render("admin/user/detail.ejs", {
        id: id,
        user: user,
        roles: roles,
    });
}

const postUpdateUser = async (req: Request, res: Response) => {
    const { id, fullName, phone, role, address } = req.body;
    const file = req.file; //Lấy file từ request, nếu không có do chưa update file thì sẽ là undefined hay null
    const avatar = file?.filename ?? undefined;//Toán tử ? sẽ kiểm tra xem file có tồn tại hay không, nếu có thì lấy tên file, nếu không thì sẽ là undefined và ?? là để giá trị default nếu file không tồn tại thì sẽ là null

    //get user by id (lấy user thông qua id rồi truyền vào view-users)
    await updateUserById(id, fullName, phone, role, address, avatar);

    return res.redirect("/admin/user");
}


export { getHomePage, getCreateUserPage, postCreateUser, postDeleteUser, getViewUser, postUpdateUser, getProductFilterPage };
