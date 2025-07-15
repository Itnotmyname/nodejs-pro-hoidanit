import express, { Express } from 'express';
import { getCreateUserPage, getHomePage, postCreateUser, postDeleteUser, getViewUser, postUpdateUser } from 'controllers/user.controller';
import { get } from 'http';
import { getAdminOrderPage, getAdminProductPage, getAdminUserPage, getDashboardPage } from 'controllers/admin/dashboard.controllers';
import fileUploadMiddleware from 'src/middleware/multer';
import { getCardPage, getProductPage, postAddProductToCart } from 'controllers/client/product.controller';
import { getAdminCreateProductPage, getViewProduct, postAdminProductPage, postdeleteProduct, postUpdateProduct } from 'controllers/admin/product.controller';
import { getLoginPage, getRegisterPage, getSuccessRedirectPage, postLogout, postRegister } from 'controllers/client/auth.controller';
import passport from 'passport';
import { isAdmin, isLogin } from 'src/middleware/auth';

const router = express.Router();

const webRoutes = (app: Express) => {
    router.get("/", getHomePage);
    router.get("/success-redirect", getSuccessRedirectPage); //Xem bài 114 phút 13:36 để hiểu ý tưởng 
    router.get("/product/:id", getProductPage);//Lấy data
    router.get("/login", getLoginPage); //Theo quy tắc code chạy từ trái sang phải nên cho chạy qua isLogin của middleware trước rồi mới getLoginPage
    router.post("/login", passport.authenticate('local', {
        successRedirect: '/success-redirect',
        failureRedirect: '/login',   //Xem bài 108 ,chỗ này là áp thư viện passport vào thôi và khai báo,tạo logic hàm login
        failureMessage: true
    }));
    router.post("/logout", postLogout);
    router.get("/register", getRegisterPage);
    router.post("/register", postRegister);

    router.post("/add-product-to-cart/:id", postAddProductToCart) //Xem bài 119 phút 2:20 ,phần id ở cuối chính là phần gọi productId
    router.get("/cart", getCardPage);

    //admin routes
    router.get("/admin", getDashboardPage);//Xem bài 114 phút 20 để hiểu tại sao lại có cái middleware isAdmin .Xem tiếp bài 116 từ phút thứ 4 để hiểu tại sao phải tối ưu middleware kiểu khác
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

    app.use("/", isAdmin, router);//xem bài 116 phút 4:13 để sử dụng trick này :áp dụng middleware vào đây luôn để tối ưu và sửa cả bên trong của function isAdmin 
}

export default webRoutes;


