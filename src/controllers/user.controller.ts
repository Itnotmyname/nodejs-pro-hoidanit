import { Request, Response } from "express";
import { handleCreateUser, getAllUsers, handleDeleteUser, getUserById, updateUserById, getAllRoles } from "services/user.service";

const getHomePage = async (req: Request, res: Response) => {
    //get users
    const users = await getAllUsers();
    return res.render("home.ejs", {
        users: users,
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

    //handle create user
    //const a = await handleCreateUser(fullName, email, address);//Lấy động người dùng ,hàm await sẽ phải cho hàm này chạy xong đã rồi mới return 

    return res.redirect("/");//Lấy được thành công thì sẽ redirect về trang chủ 
}

const postDeleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const a = await handleDeleteUser(id);
    return res.redirect("/");
}

const getViewUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    //get user by id (lấy user thông qua id rồi truyền vào view-users)
    const user = await getUserById(id);
    return res.render("view-user.ejs", {
        id: id,
        user: user
    });
}

const postUpdateUser = async (req: Request, res: Response) => {
    const { id, email, address, fullName } = req.body;

    //get user by id (lấy user thông qua id rồi truyền vào view-users)
    const a = await updateUserById(id, email, address, fullName);

    return res.redirect("/");
}


export { getHomePage, getCreateUserPage, postCreateUser, postDeleteUser, getViewUser, postUpdateUser };
