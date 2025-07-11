import { Request, Response } from "express";
import { registerNewUser } from "services/client/auth.service";
import { RegisterSchema, TRegisterSchema } from "src/validation/register.schema";

const getRegisterPage = async (req: Request, res: Response) => {
    return res.render("client/auth/register.ejs", {
        errors: [],     //Chú ý là phải có errors:[] và oldData:{fullName: "",email: "",password: "",confirmPassword: "",} nếu ko sẽ bị lỗi errors is not defined
        oldData: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    }); //Chú ý về dấu "/client/auth/.... là sai ,phải bỏ / trước client"
}

const getLoginPage = async (req: Request, res: Response) => {
    return res.render("client/auth/login.ejs");
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
export { getRegisterPage, getLoginPage, postRegister };