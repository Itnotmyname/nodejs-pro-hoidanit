import express, { Express } from 'express';
import { getCreateUserPage, getHomePage, postCreateUser, postDeleteUser, getViewUser, postUpdateUser } from 'controllers/user.controller';
import { get } from 'http';
import { getAdminOrderPage, getAdminProductPage, getAdminUserPage, getDashboardPage } from 'controllers/admin/dashboard.controllers';
import fileUploadMiddleware from 'src/middleware/multer';
import { getProductPage } from 'controllers/client/product.controller';
import { getAdminCreateProductPage, getViewProduct, postAdminProductPage, postdeleteProduct, postUpdateProduct } from 'controllers/admin/product.controller';

const router = express.Router();

const webRoutes = (app: Express) => {
    router.get("/", getHomePage);
    router.get("/product/:id", getProductPage);//Lấy data




    //admin routes
    router.get("/admin", getDashboardPage);
    router.get("/admin/user", getAdminUserPage);
    router.get("/admin/create-user", getCreateUserPage);//Lấy data
    router.post("/admin/handle-create-user", fileUploadMiddleware("avatar"), postCreateUser);
    router.post("/admin/delete-user/:id", postDeleteUser);
    router.get("/admin/view-user/:id", getViewUser);
    router.post("/admin/update-user", fileUploadMiddleware("avatar"), postUpdateUser);//Chú ý đường dẫn /handle-update-user phải giống như chỗ dòng 18 của view-user.ejs .Nghĩa là nếu bạn ghi đường dẫn là /handle-update-user/:id thì chỗ dòng 18 của view cũng phải là /handle-update-user/<%= user.id %>

    router.get("/admin/product", getAdminProductPage);
    router.get("/admin/create-product", getAdminCreateProductPage);//Lấy data thì dùng get
    router.post("/admin/create-product", fileUploadMiddleware("image", "images/product"), postAdminProductPage);//Tạo mới data thì dùng post

    router.post("/admin/delete-product/:id", postdeleteProduct);
    router.get("/admin/view-product/:id", getViewProduct);
    router.post("/admin/update-product", fileUploadMiddleware("image", "images/product"), postUpdateProduct);


    router.get("/admin/order", getAdminOrderPage);

    app.use("/", router);
}

export default webRoutes;


