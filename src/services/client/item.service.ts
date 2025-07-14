
import { prisma } from "config/client";

const getProducts = async () => {
    const products = await prisma.product.findMany();
    return products;
}

const getProductById = async (id: number) => {
    return await prisma.product.findUnique({
        where: { id: +id }
    })
}

const addProductToCart = async (quantity: number, productId: number, user: Express.User) => {  // Xem bài 119 phút 6:10 để xem giải thích tại sao lại như vậy
    const cart = await prisma.cart.findUnique({
        where: {
            userId: (user as any).id,//Tạm thời thêm kiểu user as any này vào nếu ko sẽ có lỗi "Property 'id' does not exist on type 'User'"
        }
    })

    const product = await prisma.product.findUnique({
        where: { id: productId }
    }) //Xem bài 119 phút 13

    if (cart) {
        //update
    } else {
        //create
        await prisma.cart.create({ //Xem bài 119 phút thứ 11 để hiểu nhé
            data: {
                sum: quantity,
                userId: (user as any).id, //Tạm thời thêm kiểu user as any này vào nếu ko sẽ có lỗi "Property 'id' does not exist on type 'User'"
                cartDetails: {
                    create: [
                        {
                            price: product.price,
                            quantity: quantity,
                            productId: productId,
                        }
                    ]
                }
            }
        })
    }
}

export { getProducts, getProductById, addProductToCart };