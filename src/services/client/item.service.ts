
import { prisma } from "config/client";
import e from "express";

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
        const currentCartDetailelse = await prisma.cart.create({ //Xem bài 119 phút thứ 11 để hiểu nhé
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
        console.log(currentCartDetailelse);
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
        console.log(currentCartDetail);
        return currentCartDetail; //Nếu có cart thì trả ra ,dùng findMany vì 1 giỏ hàng có nhiều sản phẩm
    }
    return []; //Nếu ko có thì trả ra điều kiện array rỗng ,xem bài 122 khoảng phút 5
}

const deleteProductInCart = async (cartDetailId: number, userId: number, sumCart: number) => {  // Xem bài 119 phút 6:10 để xem giải thích tại sao lại như vậy
    //xóa cart-detail
    const currentCartDetail = await prisma.cartDetail.findUnique({
        where: { id: cartDetailId }
    });
    if (!currentCartDetail) {
        // Có thể trả về hoặc throw error, hoặc return [] để kết thúc hàm
        return [];
    }
    const quantities = currentCartDetail.quantity; //Lấy quantity của sản phẩm trong giỏ hàng để trừ đi

    await prisma.cartDetail.delete({
        where: { id: cartDetailId }
    });

    if (sumCart === 1) {
        await prisma.cart.delete({
            where: { userId: userId }, //Tìm theo cart
        })
    } else {
        //update cart 
        await prisma.cart.update({
            where: { userId: userId },
            data: {
                sum: {
                    decrement: quantities, //Xem bài 124 phút 04:28 ,đây là hàm logic của prisma ,trừ đi 1 đơn vị .Đã sửa đổi lại tại bào 130 phút 6:20
                }
            }
        })
    }

    return []; //Nếu ko có thì trả ra điều kiện array rỗng ,xem bài 124 khoảng phút 5
}

const updateCartDetailBeforeCheckout = async (data: { id: string; quantity: string }[],
    cartId: string
) => { //Cái :{id:string;quantity:string} là đang quy định kiểu type cho data ,còn bản chất là data[] thôi
    let quantity = 0;

    for (let i = 0; i < data.length; i++) {
        quantity += +(data[i].quantity); //Cộng dồn quantity của các sản phẩm trong giỏ hàng để tính tổng số lượng sản phẩm ,bản chất là : quantity = quantity + +(data[i].quantity) .Lưu ý là phải convert sang kiểu number vì data[i].quantity là kiểu string
        const updatecartdettail = await prisma.cartDetail.update({  //Xem phút thứ 10 bài 126
            where: {
                id: +(data[i].id)
            },
            data: {
                quantity: +(data[i].quantity) //convert sang daạng number
            }
        })
        console.log(updatecartdettail);
    }

    //update cart sum
    const updatecartsum = await prisma.cart.update({
        where: { id: +cartId },
        data: {
            sum: quantity,
        }
    })
    console.log(updatecartsum);
}

const handlerPlaceOrder = async (
    userId: number,
    receiverName: string,
    receiverAddress: string,
    receiverPhone: string,
    totalPrice: number,
) => {
    try {
        //tạo transaction
        await prisma.$transaction(async (giaodich) => {

            const cart = await giaodich.cart.findUnique({
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

                await giaodich.order.create({
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



                //check product
                for (let i = 0; i < cart.cartDetails.length; i++) {
                    const productId = cart.cartDetails[i].productId;
                    const product = await giaodich.product.findUnique({
                        where: { id: productId }
                    });

                    if (!product || product.quantity < cart.cartDetails[i].quantity) {
                        throw new Error(`"Sản phẩm ${product?.name} không tồn tại hoặc không đủ số lượng để đặt hàng"`);
                    }

                    const testne = await giaodich.product.update({
                        where: { id: productId },
                        data: {
                            quantity: {
                                decrement: cart.cartDetails[i].quantity,
                            },
                            sold: {
                                increment: cart.cartDetails[i].quantity,
                            }
                        }
                    })
                }

                //remove cart detail + cart 
                await giaodich.cartDetail.deleteMany({
                    where: { cartId: cart.id } //xóa theo điều kiện where ở đây là id của bảng carts trong mySQL rồi sau đó mới gán value cho cartId .Rồi lúc này mới xóa theo điều kiện cartId của bảng cart_detail
                }) //xóa nhiều bản ghi 1 lúc  ,xem file doc để hiểu hơn 

                await giaodich.cart.delete({
                    where: { id: cart.id }
                })
            }
        })
        return "";
    } catch (error) {
        console.log(error)
        return error.message; //Trả về thông báo lỗi nếu có
    }

}

const getOrderHistory = async (userId: number) => {
    return await prisma.order.findMany({
        where: { userId: userId },
        include: {    //Xem baì 129 phút 2 vì đây là trường hợp bọc 3 lớp include của prisma
            orderDetails: {
                include: {
                    product: true
                }
            }
        },
    });
}

export { getProducts, getProductById, addProductToCart, getProductInCart, deleteProductInCart, updateCartDetailBeforeCheckout, handlerPlaceOrder, getOrderHistory };