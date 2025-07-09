import { error } from "console";
import { name } from "ejs";
import { Request, Response } from "express";
import { ProductSchema, TProductSchema } from "src/validation/product.schema";
import { createProduct } from "services/admin/product.service";

const getAdminCreateProductPage = async (req: Request, res: Response) => {
    const errors = [];
    const oldData = {  //Xem bài 97 phút 11:47
        name: "",
        price: "",
        detailDesc: "",
        shortDesc: "",
        quantity: "",
        factory: "",
        target: "",
    }
    return res.render("admin/product/create.ejs", {
        errors: errors,//Truyền vào view để hiển thị ra các lỗi nếu có
        oldData: oldData, //Truyền vào view để hiển thị lại dữ liệu đã nhập nếu có lỗi mà không bị mất đi
    });
}
const postAdminProductPage = async (req: Request, res: Response) => {
    const { name, price, detailDesc, shortDesc, quantity, factory, target } = req.body as TProductSchema; //"as" dùng để ép kiểu dữ liệu của req.body về TProductSchema

    const validate = ProductSchema.safeParse(req.body);

    if (!validate.success) {
        //error
        const errorsZod = validate.error.issues;
        const errors = errorsZod.map(item => `${item.message} (${item.path[0]})`); //Lấy ra các lỗi từ validate.error.issues
        const oldData = {  //Xem bài 97 phút 11:47
            name: name, price: price, detailDesc: detailDesc, shortDesc: shortDesc, quantity: quantity, factory: factory, target: target, //Có thể viết gọn hơn là {name,price,...} vì tên biến và tên thuộc tính giống nhau key giống value
        }
        return res.render("admin/product/create.ejs", {
            errors: errors,
            oldData: oldData, //Truyền vào view để hiển thị ra các lỗi nếu có
        });

    }

    //success,create a new product    
    const image = req?.file?.filename ?? null;//Toán tử ? sẽ kiểm tra xem file có tồn tại hay không, nếu có thì lấy tên file, nếu không thì sẽ là undefined và ?? là để giá trị default nếu file không tồn tại thì sẽ là null
    await createProduct(name, +price, detailDesc, shortDesc, +quantity, factory, target, image);//Gọi hàm createProduct để tạo mới sản phẩm
    return res.redirect("/admin/product");
}
export { getAdminCreateProductPage, postAdminProductPage };


