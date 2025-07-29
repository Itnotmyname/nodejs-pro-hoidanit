
import { Request, Response } from "express";
import { handleDeleteUserById, handleGetAllUser, handleGetUserById, handleUpdateUserById } from "services/client/api.service";
import { registerNewUser } from "services/client/auth.service";
import { addProductToCart } from "services/client/item.service";
import { RegisterSchema, TRegisterSchema } from "src/validation/register.schema";


const postAddProductToCartAPI = async (req: Request, res: Response) => {

    const { quantity, productId } = req.body;
    const user = req.user;

    const currentSum = (req.user as any)?.sumCart ?? 0;
    const newSum = currentSum + (+quantity);

    await addProductToCart(+quantity, +productId, user);

    res.status(200).json({
        data: newSum
    })
}

const getAllUsersAPI = async (req: Request, res: Response) => {

    const users = await handleGetAllUser();
    res.status(200).json({
        data: users
    })
}

const getUserByIdAPI = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await handleGetUserById(+id);
    res.status(200).json({
        data: user
    })
}

const createUserAPI = async (req: Request, res: Response) => {
    const { fullName, email, password } = req.body as TRegisterSchema

    const validate = await RegisterSchema.safeParseAsync(req.body);
    if (!validate.success) {
        //error
        const errorsZod = validate.error.issues; //Phần này ở bài 104 căn bản giống với product.controller.ts
        const errors = errorsZod.map(item => `${item.message} (${item.path[0]})`); //Lấy ra các lỗi từ validate.error.issues

        res.status(400).json({
            errors: errors
        })
        return; //tránh chạy xong rồi mà vẫn chạy xuống phần success
    }
    //success
    await registerNewUser(fullName, email, password);

    res.status(201).json({
        data: "create user succeed"
    })
}

const updateUserByIdAPI = async (req: Request, res: Response) => {
    const { fullName, address, phone } = req.body;
    const { id } = req.params;

    //success
    await handleUpdateUserById(+id,fullName, address, phone);

    res.status(200).json({
        data: "Update user succeed"
    })
}

const deleteUserByIdAPI = async (req: Request, res: Response) => {
    const { id } = req.params;

    //success
    await handleDeleteUserById(+id);

    res.status(200).json({
        data: "Delete user succeed"
    })
}

export { postAddProductToCartAPI, getAllUsersAPI, getUserByIdAPI, createUserAPI, updateUserByIdAPI, deleteUserByIdAPI }