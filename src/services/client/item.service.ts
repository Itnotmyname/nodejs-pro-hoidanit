
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

const getProductInCart = async (userId: number) => {  // Xem bài 119 phút 6:10 để xem giải thích tại sao lại như vậy
    const cart = await prisma.cart.findUnique({
        where: { userId: userId }
    })

    if (cart) { //Nếu mà có giỏ hàng (tìm theo id á)
        const currentCartDetail = await prisma.cartDetail.findMany({
            where: { cartId: cart.id }, //Tìm theo cartId 
            include: { product: true } //Đồng thời lấy thêm thông tin product thôi,hàm include của prisma sẽ khá giống truy vấn JOIN của mySQL là kiểu truy vấn thuộc tính giữa bảng cart_detail và bảng products.Do đó khi di chuột vào cartDetails ta lại thấy có các thuộc tính của products
        })
        return currentCartDetail; //Nếu có cart thì trả ra ,dùng findMany vì 1 giỏ hàng có nhiều sản phẩm
    }
    return []; //Nếu ko có thì trả ra điều kiện array rỗng ,xem bài 122 khoảng phút 5
}

const deleteProductInCart = async (cartDetailId: number, userId: number, sumCart: number) => {  // Xem bài 119 phút 6:10 để xem giải thích tại sao lại như vậy
    //xóa cart-detail
    const cartDetail = await prisma.cartDetail.delete({
        where: { id: cartDetailId }
    })

    if (sumCart === 1) {
        await prisma.cart.delete({
            where: { userId: userId }, //Tìm theo cartId 
        })
    } else {
        //update cart 
        await prisma.cart.update({
            where: { userId: userId },
            data: {
                sum: {
                    decrement: 1, //Xem bài 124 phút 04:28 ,đây là hàm logic của prisma ,trừ đi 1 đơn vị
                }
            }
        })
    }

    return []; //Nếu ko có thì trả ra điều kiện array rỗng ,xem bài 122 khoảng phút 5
}

const updateCartDetailBeforeCheckout = async (data: { id: string; quantity: string }[]) => { //Cái :{id:string;quantity:string} là đang quy định kiểu type cho data ,còn bản chất là data[] thôi
    for (let i = 0; i < data.length; i++) {
        await prisma.cartDetail.update({  //Xem phút thứ 10 bài 126
            where: {
                id: +(data[i].id)
            },
            data: {
                quantity: +(data[i].quantity) //convert sang daạng number
            }
        })
    }
}

const handlerPlaceOrder = async (
    userId: number,
    receiverName: string,
    receiverAddress: string,
    receiverPhone: string,
    totalPrice: number,
) => {

    const cart = await prisma.cart.findUnique({
        where: { userId: userId },
        include: {
            cartDetails: true
        }
    });
    if (cart) {
        //create order
        const dataOrderDetail = cart?.cartDetails?.map(
            item => ({
                price: item.price,
                quantity: item.quantity,
                productId: item.productId
            })
        ) ?? [];

        await prisma.order.create({
            data: {
                receiverName: receiverName,
                receiverAddress: receiverAddress,
                receiverPhone: receiverPhone,
                paymentMethod: "COD",
                paymentStatus: "PAYMENT_UNPAID",
                status: "PENDING",
                totalPrice: totalPrice, //Xem bài 125 phút 13 gần phút 15
                userId: userId,
                orderDetails: {
                    create: dataOrderDetail,
                }
            }
        })

        //remove cart detail + cart 
        await prisma.cartDetail.deleteMany({
            where: { cartId: cart.id } //xóa theo điều kiện where ở đây là id của bảng carts trong mySQL rồi sau đó mới gán value cho cartId .Rồi lúc này mới xóa theo điều kiện cartId của bảng cart_detail
        }) //xóa nhiều bản ghi 1 lúc  ,xem file doc để hiểu hơn 

        await prisma.cart.delete({
            where: { id: cart.id }
        })
    }

}

export { getProducts, getProductById, addProductToCart, getProductInCart, deleteProductInCart, updateCartDetailBeforeCheckout, handlerPlaceOrder };