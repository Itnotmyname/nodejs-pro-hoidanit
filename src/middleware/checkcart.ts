import { Request, Response, NextFunction } from "express";
import { getProductInCart } from "src/services/client/item.service";

const checkCart = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
        const cartDetails = await getProductInCart((req.user as any).id);
        (req.user as any).sumCart = cartDetails.length; 
    }
    next();
};

export { checkCart };


// router.get("/cart", checkCart, getCardPage);  Đây là cách sử dụng middleware để check lại giỏ hàng
// router.post("/delete-product-in-cart/:id", checkCart, postDeleteProductInCart);