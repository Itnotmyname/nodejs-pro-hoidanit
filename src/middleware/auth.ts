import { Request, Response, NextFunction } from "express";

const isLogin = (req: Request, res: Response, next: NextFunction) => {
    const isAuthenticated = req.isAuthenticated();
    if (isAuthenticated) {  //Nếu đã đăng nhập rồi
        res.redirect("/")    //Xem tại bài 114 phút 4:30
        return; //Nếu không return thì sẽ bị redirect lặp vô hạn ,dẫn đến cảnh báo too many redirect.Xem bài 115 từ phút 1:30 trở ra để hiểu
    } else {
        next(); //Người dùng chưa đăng nhập thì cố gắng đi tiếp vào trang login đấy
    }
}

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    //apply only to router "/admin" xem bài 116 phút 5
    if (req.path.startsWith('/admin')) { //Nếu như req.path bắt đầu với đường link admin thì sẽ lấy thông tin về user  
        const user = req.user as any;

        if (user?.role?.name === "ADMIN") {  //Nếu người dùng có Role là admin sẽ cho người dùng vào trang admin
            next();  //Xem tại bài 114 phút 19:40 và 115 phút 2:26
            return;//Nếu không return thì sẽ bị redirect lặp vô hạn ,dẫn đến cảnh báo too many redirect .Xem bài 115 từ phút 1:30 trở ra để hiểu
        } else {
            res.render("status/403.ejs"); //Người dùng không phải có role là admin thì sex render ra file 403.ejs
        }
        return; //Cần return để thoát khỏi function này và không chạy xuống phần next() ở dòng 28 nữa
    }

    //client routes
    next(); //Đối với client route thì vẫn chạy bình thường
}



export { isLogin, isAdmin };