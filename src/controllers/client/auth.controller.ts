import { NextFunction, Request, Response } from "express";
import { registerNewUser } from "services/client/auth.service";
import { RegisterSchema, TRegisterSchema } from "src/validation/register.schema";

const getRegisterPage = async (req: Request, res: Response) => {
    return res.render("client/auth/register.ejs", {
        errors: [],     //Chú ý là phải có errors:[] và oldData:{fullName: "",email: "",password: "",confirmPassword: "",} nếu ko sẽ bị lỗi errors is not defined
        oldData: {          //Hoặc là ghi là errors,oldData không thôi cũng được
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    }); //Chú ý về dấu "/client/auth/.... là sai ,phải bỏ / trước client"
}

const getLoginPage = async (req: Request, res: Response) => {

    const { session } = req as any; //Xem bài 110 phút thứ 7 để hiểu tại sao lại là req as any
    const messages = session?.messages ?? []; //Bởi vì sẽ có trường hợp session bằng null tức là ko có session nên dùng toán tử ?. và sau đó ra [] .Nhớ là phải đúng chính tả chữ messages có "s" nhé ,trước bị lỗi ở đây
    return res.render("client/auth/login.ejs", {
        messages: messages,
    });
}

const postRegister = async (req: Request, res: Response) => {
    const { fullName, email, password, confirmPassword } = req.body as TRegisterSchema

    const validate = await RegisterSchema.safeParseAsync(req.body);
    if (!validate.success) {
        //error
        const errorsZod = validate.error.issues; //Phần này ở bài 104 căn bản giống với product.controller.ts
        const errors = errorsZod.map(item => `${item.message} (${item.path[0]})`); //Lấy ra các lỗi từ validate.error.issues
        const oldData = {
            fullName: fullName, email: email, password: password, confirmPassword: confirmPassword, //Có thể viết gọn
        }
        return res.render("client/auth/register.ejs", {
            errors: errors,
            oldData: oldData,
        });
    }
    //success
    await registerNewUser(fullName, email, password);

    return res.redirect("/login");
}

const getSuccessRedirectPage = async (req: Request, res: Response) => {
    const user = req.user as any; //Xem bài 114 phút thứ 15 
    if (user?.role?.name === "ADMIN") {   //Nếu user hay role không hể tồn tại sẽ trả ra undified còn nếu trả ra "ADMIN" thì thực hiện res.redirect("/admin")
        res.redirect("/admin")
    } else {
        res.redirect("/")
    }

}

const postLogout = async (req: Request, res: Response, next: NextFunction) => {
    req.logout(function (err) {
        if (err) {
            return next(err);   //Logic này là của thư viện passport cụ thể xem bài 115 phút 4
        }
        res.redirect('/');
    });

}


export { getRegisterPage, getLoginPage, postRegister, getSuccessRedirectPage, postLogout };