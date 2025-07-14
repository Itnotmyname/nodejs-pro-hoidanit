import { Request, Response } from "express";
import { addProductToCart, getProductById } from "services/client/item.service";

const getProductPage = async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await getProductById(+id);
    return res.render("client/product/detail.ejs", {
        product: product
    });
}

const postAddProductToCart= async (req:Request,res:Response)=>{
    const {id}=req.params; //Xewm bài 119 phút 3:20 và id này là lấy từ params prisma hoặc hiểu là id vừa truyền lên
    const user =req.user;

    if(user){ //Nếu mà có user thì mới truyền vào function
        await addProductToCart(1, +id, user); //Xem bài 119 và 1 là quantity,+id là convert id sang kiểu number và là productId,user thì là user
    }else{
        return res.redirect("/login");//Còn nếu ko có người dùng thì redirect về login
    }
    

    return res.redirect("/");
}

export { getProductPage, postAddProductToCart };

