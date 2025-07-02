import express, { Express } from 'express';
import { getCreateUserPage, getHomePage, postCreateUser, postDeleteUser, getViewUser, postUpdateUser } from 'controllers/user.controller';
import { get } from 'http';
const router = express.Router();

const webRoutes = (app: Express) => {
    router.get("/", getHomePage);
    router.get("/create-user", getCreateUserPage);//Lấy data
    router.post("/handle-create-user", postCreateUser);//Gửi data ,method :"post"
    router.post("/handle-delete-user/:id", postDeleteUser);
    router.get("/handle-view-user/:id", getViewUser);
    router.post("/handle-update-user", postUpdateUser);//Chú ý đường dẫn /handle-update-user phải giống như chỗ dòng 18 của view-user.ejs .Nghĩa là nếu bạn ghi đường dẫn là /handle-update-user/:id thì chỗ dòng 18 của view cũng phải là /handle-update-user/<%= user.id %>

    app.use("/", router);
}

export default webRoutes;


