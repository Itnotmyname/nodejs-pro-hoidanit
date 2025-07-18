import { Request, Response } from "express";
import { addProductToCart, deleteProductInCart, getProductById, getProductInCart, handlerPlaceOrder, updateCartDetailBeforeCheckout } from "services/client/item.service";

const getProductPage = async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await getProductById(+id);
    return res.render("client/product/detail.ejs", {
        product: product
    });
}

const postAddProductToCart = async (req: Request, res: Response) => {
    const { id } = req.params; //Xewm bài 119 phút 3:20 và id này là lấy từ params prisma hoặc hiểu là id vừa truyền lên
    const user = req.user;

    if (user) { //Nếu mà có user thì mới truyền vào function
        await addProductToCart(1, +id, user); //Xem bài 119 và 1 là quantity,+id là convert id sang kiểu number và là productId,user thì là user
    } else {
        return res.redirect("/login");//Còn nếu ko có người dùng thì redirect về login
    }


    return res.redirect("/");
}

const getCardPage = async (req: Request, res: Response) => {
    const user: any = req.user;
    if (!user) {
        return res.redirect("/login"); //Xem phút thứ 2 bài 121
    }

    const cartDetails = await getProductInCart(+user.id);
    const totalPrice = cartDetails?.map(item => +item.price * +item.quantity)
        ?.reduce((a, b) => a + b, 0); //Đây là level cao hơn của javascript ,xem video 122 phút 6:08 .Đầu tiên là function map nó sẽ trả ra array .Array này sẽ chứa number là tổng số tiền của sản phẩm .Sử dụng hàm reduce của javascript để cộng vào

    return res.render("client/product/cart.ejs", {
        cartDetails, totalPrice
    });
}

const postDeleteProductInCart = async (req: Request, res: Response) => {
    const { id } = req.params; //Xem bài 119 phút 3:20 và id này là lấy từ params prisma hoặc hiểu là id vừa truyền lên trên URL khi gọi tới route đó (tức là id của router á )
    const user: any = req.user;

    if (user) { //Nếu mà có user thì mới truyền vào function
        await deleteProductInCart(+id, user.id, user.sumCart); //Xem bài 119 và 1 là quantity,+id là convert id sang kiểu number và là productId,user thì là user
        //Th
    } else {
        return res.redirect("/login");//Còn nếu ko có người dùng thì redirect về login
    }

    return res.redirect("/cart");
}

const getCheckOutPage = async (req: Request, res: Response) => {
    const user: any = req.user;
    if (!user) {
        return res.redirect("/login"); //Xem phút thứ 2 bài 121
    }

    const cartDetails = await getProductInCart(+user.id);
    const totalPrice = cartDetails?.map(item => +item.price * +item.quantity)
        ?.reduce((a, b) => a + b, 0); //Đây là level cao hơn của javascript ,xem video 122 phút 6:08 .Đầu tiên là function map nó sẽ trả ra array .Array này sẽ chứa number là tổng số tiền của sản phẩm .Sử dụng hàm reduce của javascript để cộng vào

    return res.render("client/product/checkout.ejs", {
        cartDetails, totalPrice
    });
}

const postHandleCartToCheckOut = async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
        return res.redirect("/login");
    }

    const currentCartDetail: { id: string; quantity: string }[] = req.body?.cartDetails ?? [];
    //Lưu ý phải có mảng (array) ở đằng sau currentCartDetail vì tại updateCartDetailBeforeCheckout 
    await updateCartDetailBeforeCheckout(currentCartDetail);
    return res.redirect("/checkout");
}

const postPlaceOrder = async (req: Request, res: Response) => {
    const user:any = req.user;
    if (!user) {
        return res.redirect("/login");
    }
    const {receiverName,receiverAddress,receiverPhone,totalPrice} = req.body; //Lấy receiverName,receiverAddress,receiverPhone từ req và cụ thể là body trong req từ user (nói chung là phần req ở lúc sử dụng debug để xem ý).Lấy cả totalPrice ở trong đó nữa
//Những thông số này được khai ở html được user điền vào từ web rồi ta mới lấy từ req và ở đây là req.body
    await handlerPlaceOrder(user.id,receiverName,receiverAddress,receiverPhone,+totalPrice); 
    return res.redirect("/thanks");
}

const getThanksPage = async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
        return res.redirect("/login");
    }
    return res.render("client/product/thanks.ejs");
}

export { getProductPage, postAddProductToCart, getCardPage, postDeleteProductInCart, getCheckOutPage, postHandleCartToCheckOut, postPlaceOrder, getThanksPage };

