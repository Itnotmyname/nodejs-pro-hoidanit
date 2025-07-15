
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
        //update giỏ hàng
        await prisma.cart.update({
            where: { id: cart.id },
            data: {
                //sum:cart.sum +quantity, cách này cũng ok nhưng mà nên dùng cách thư viện prisma cho tiện
                sum: {
                    increment: quantity, //Hàm update a number fields của prisma
                }
            }
        })
        //update card-detail
        //Nếu chưa có tạo mới còn có rồi thì cập nhật quantity
        //upsert là viết tắt của từ update+insert :nếu đã tồn tại thì cập nhật còn nếu ko tồn tại thì insert ,xem bài 120 phút 4:50

        //Xem baif 120 phút 7 để hiểu tại sao cần tạo currentCartDetail cũng như sử dụng findFirst của prisma để query ra giá trị gần nhất
        const currentCartDetail = await prisma.cartDetail.findFirst({
            where: {
                productId: productId,
                cartId: cart.id
            }
        })

        await prisma.cartDetail.upsert({
            where: { //Lí do where bị lỗi cần "CartDetailWhereUniqueInput " do ta chưa quy định productId hay cartId ở dưới là unique nên cần giải quyết ,xem bài 120 phút 6:30
                id: currentCartDetail?.id ?? 0 //Lí do là trong trường hợp hàm chưa tồn tại 2 cái productId hay cartId thì findFirst của prisma sẽ trả ra chẳng hạn như object rỗng hay null thì trong trường hợp này dùng toán tử chain để có thể về giá trị default là 0.Tức là id =0.Nhưng trong bảng cartdetail mySQL thì bắt đầu bằng id=1 nên là không có.Suy ra trong trường hợp đó nó ko có .Dẫn đến nó sẽ chạy vào hàm create 
            },//Xem thêm bài 120 phút 8 để hiểu
            update: {
                quantity: {
                    increment: quantity,
                }
            },
            create: {
                price: product.price,
                quantity: quantity,
                productId: productId,
                cartId: cart.id
            },
        })


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