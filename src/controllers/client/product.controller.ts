import { Request, Response } from "express";
import { addProductToCart, deleteProductInCart, getOrderHistory, getProductById, getProductInCart, handlerPlaceOrder, updateCartDetailBeforeCheckout } from "services/client/item.service";

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

    const cartId = cartDetails.length ? cartDetails[0].cartId : 0; //Lấy cartId từ cartDetails để sử dụng trong quá trình checkout ,toán tử 3 ngôi
    console.log(getCardPage);
    return res.render("client/product/cart.ejs", {
        cartDetails, totalPrice, cartId
    });

}

const postDeleteProductInCart = async (req: Request, res: Response) => {
    const { id } = req.params; //Xem bài 119 phút 3:20 và id này là lấy từ params prisma hoặc hiểu là id vừa truyền lên trên URL khi gọi tới route đó (tức là id của router á )
    const user: any = req.user;

    if (user) { //Nếu mà có user thì mới truyền vào function
        await deleteProductInCart(+id, user.id, user.sumCart); //Xem bài 119 và 1 là quantity,+id là convert id sang kiểu number và là productId,user thì là user

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

    const { cartId } = req.body; //Lấy cartId từ body của request .Vì ở file checkout.ejs có input name="cartId" nên ở đây ta lấy ra cartId từ body của request
    const currentCartDetail: { id: string; quantity: string }[] = req.body?.cartDetails ?? [];
    //Lưu ý phải có mảng (array) ở đằng sau currentCartDetail vì tại updateCartDetailBeforeCheckout 

    await updateCartDetailBeforeCheckout(currentCartDetail, cartId);
    return res.redirect("/checkout");
}

const postPlaceOrder = async (req: Request, res: Response) => {
    const user: any = req.user;
    if (!user) {
        return res.redirect("/login");
    }
    const { receiverName, receiverAddress, receiverPhone, totalPrice } = req.body; //Lấy receiverName,receiverAddress,receiverPhone từ req và cụ thể là body trong req từ user (nói chung là phần req ở lúc sử dụng debug để xem ý).Lấy cả totalPrice ở trong đó nữa


    //Những thông số này được khai ở html được user điền vào từ web rồi ta mới lấy từ req và ở đây là req.body
    const message = await handlerPlaceOrder(user.id, receiverName, receiverAddress, receiverPhone, +totalPrice);
    console.log("check message", message);
    
    if (message) {
        return res.redirect("/checkout"); //Nếu có message thì redirect về checkout
    }
    return res.redirect("/thanks");





}

const getThanksPage = async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
        return res.redirect("/login");
    }
    return res.render("client/product/thanks.ejs");
}

const getOrderHistoryPage = async (req: Request, res: Response) => {
    const user: any = req.user;
    if (!user) {
        return res.redirect("/login");
    }
    const orders = await getOrderHistory(user.id);
    return res.render("client/product/order-history.ejs", {
        orders: orders,
    });
}

const postAddToCartFromDetailPage = async (req: Request, res: Response) => {
    const { id } = req.params; //Lấy id từ params URL
    const { quantity } = req.body; //Lấy quantity từ body của request .Và vì file detail.ejs có input name="quantity" nên ở đây ta lấy ra quantity từ body của request
    const user = req.user;
    if (!user) {
        return res.redirect("/login");
    }

    await addProductToCart(+quantity, +id, user); //Xem bài 130 phút 9:23 để hiểu ý tưởng
    return res.redirect(`/product/${id}`); //Sau khi thêm vào giỏ hàng thì chuyển hướng về trang chi tiết sản phẩm
}
export { getProductPage, postAddProductToCart, getCardPage, postDeleteProductInCart, getCheckOutPage, postHandleCartToCheckOut, postPlaceOrder, getThanksPage, getOrderHistoryPage, postAddToCartFromDetailPage };

