import { prisma } from "config/client"

const userFilter = async (usernameInput: string) => {
    return await prisma.user.findMany({
        where: {
            username: {
                contains: usernameInput, //Tìm kiếm người dùng có username chứa chuỗi username
            },
        },
    });
}

/* Yêu cầu 1: http://localhost:8080/products?minPrice=1000000
 Lấy ra tất cả sản phẩm có giá (price) tối thiểu là 1.000.000 (vnd) */

const yeuCau1 = async (minPrice: number) => {
    return await prisma.product.findMany({
        where: {
            price: {
                gte: minPrice //Lấy tất cả sản phẩm có giá lớn hơn hoặc bằng minPrice
            }
        }
    })
}

/*Yêu cầu 2: http://localhost:8080/products?maxPrice=15000000
Lấy ra tất cả sản phẩm có giá (price) tối đa  là 15.000.000 (vnd)*/

const yeuCau2 = async (maxPrice: number) => {
    return await prisma.product.findMany({
        where: {
            price: {
                lte: maxPrice //Lấy tất cả sản phẩm có giá nhỏ hơn hoặc bằng maxPrice
            }
        }
    })
}

/*Yêu cầu 3: http://localhost:8080/products?factory=APPLE
Lấy ra tất cả sản phẩm có hãng sản xuất = APPLE*/

const yeuCau3 = async (factory: string) => {
    return await prisma.product.findMany({
        where: {
            factory: {
                equals: factory //Lấy tất cả sản phẩm có hãng sản xuất bằng factory}
            }
        }
    })
}

/*Yêu cầu 4: http://localhost:8080/products?factory=APPLE,DELL
Lấy ra tất cả sản phẩm có hãng sản xuất = APPLE hoặc DELL . Truyền nhiều điều kiện, ngăn cách các giá trị bởi dấu phẩy (điều kiện IN)
*/

const yeuCau4 = async (factoryArray: string[]) => {
    return await prisma.product.findMany({
        where: {
            factory: {
                in: factoryArray //Lấy tất cả sản phẩm có hãng sản xuất bằng một trong các giá trị trong mảng factories
            }
        }
    })
}

/*Yêu cầu 5: http://localhost:8080/products?price=10-toi-15-trieu
Lấy ra tất cả sản phẩm theo range (khoảng giá).  10 triệu <= price <= 15 triệu
*/

const yeuCau5 = async (minPrice: number, maxPrice: number) => {
    return await prisma.product.findMany({
        where: {
            price: {
                gte: minPrice, //Lấy tất cả sản phẩm có giá lớn hơn hoặc bằng minPrice
                lte: maxPrice //Lấy tất cả sản phẩm có giá nhỏ hơn hoặc bằng maxPrice
            } //Đây là cách dùng toán tử AND đầu tiên
        }
    })
}

/*Yêu cầu 6: http://localhost:8080/products?price=10-toi-15-trieu,16-toi-20-trieu
Lấy ra tất cả sản phẩm theo range (khoảng giá).  10 triệu <= price <= 15 triệu và
16 triệu <= price <= 20 triệu (Phối hợp điều kiện OR và AND)*/


const yeuCau6 = async () => {
    return await prisma.product.findMany({
        where: {
            OR: [ //Sử dụng toán tử OR để kết hợp các điều kiện
                {
                    price: {
                        gte: 10000000, //Lấy tất cả sản phẩm có giá lớn hơn hoặc bằng 10 triệu
                        lte: 15000000 //Lấy tất cả sản phẩm có giá nhỏ hơn hoặc bằng 15 triệu
                    }
                },
                {
                    price: {
                        gte: 16000000, //Lấy tất cả sản phẩm có giá lớn hơn hoặc bằng 16 triệu
                        lte: 20000000 //Lấy tất cả sản phẩm có giá nhỏ hơn hoặc bằng 20 triệu
                    }
                }
            ]
        }
    })
}

/* Yêu cầu 7: http://localhost:8080/products?sort=price,asc
Lấy ra tất cả sản phẩm và sắp xếp theo giá tăng dần*/

const yeuCau7 = async () => {
    return await prisma.product.findMany({
        orderBy: {
            price: "asc" //Sắp xếp theo giá tăng dần
        }
    })
}

/* Yêu cầu 8: http://localhost:8080/products?sort=price,dsc
Lấy ra tất cả sản phẩm và sắp xếp theo giá giảm dần*/

const yeuCau8 = async () => {
    return await prisma.product.findMany({
        orderBy: {
            price: "desc" //Sắp xếp theo giá trị giảm dần 
        }
    })
}

const getProductWithFilter = async (
    page: number,
    pageSize: number,
    factory: string,
    target: string,
    price: string,
    sort: string
) => {

    //build where query
    let whereClause: any = {}; //Coi như whereClause là một object 

    if (factory) {
        const factoryInput = factory.split(",")
        whereClause.factory = {
            in: factoryInput
        };
    }
    // whereClause ={
    //     facatory: {...},
    //     target: {...},
    // }

    if (target) {
        const targetInput = target.split(",")
        whereClause.target = {
            in: targetInput
        };
    }

    if (price) {
        const priceInput = price.split(",");
        // ["duoi-10-trieu", "10-toi-15-trieu", "15-toi-20-trieu", "tren-20-trieu"] //Kiểm tra xem giá trị của price có nằm trong mảng này không

        const priceConditions = []; //Tạo một mảng để chứa các điều kiện về giá

        for (let i = 0; i < priceInput.length; i++) {
            if (priceInput[i] === "duoi-10-trieu") {
                priceConditions.push({ "price": { "lt": 10000000 } });
            }
            if (priceInput[i] === "10-toi-15-trieu") {
                priceConditions.push({ "price": { "gte": 10000000, "lte": 15000000 } });
            }
            if (priceInput[i] === "15-toi-20-trieu") {
                priceConditions.push({ "price": { "gte": 15000000, "lte": 20000000 } });
            }
            if (priceInput[i] === "tren-20-trieu") {
                priceConditions.push({ "price": { "gt": 20000000 } });
            }
        }

        whereClause.OR = priceConditions; //Gán mảng priceConditions vào whereClause với toán tử OR
    }
    /* whereClasuse = {    
    OR:[
        {"price":{"lt":10000000}},
        {"price":{"gte":10000000,"lte":15000000}}
        ]*/


    //build sort query
    let orderByClause: any = {};
    if (sort) {
        if (sort === "gia-tang-dan") {
            orderByClause = {
                price: "asc"
            }
        }
        if (sort === "gia-giam-dan") {
            orderByClause = {
                price: "desc"
            }
        }
    }

    const skip = (page - 1) * pageSize; //Tính toán số lượng sản phẩm cần bỏ qua dựa trên trang hiện tại và kích thước trang

    const [products, count] = await prisma.$transaction([ //Xem tại phút 18 bài 147 đây là cách viết tối ưu và hiệu suất hơn của transaction trong prisma
        prisma.product.findMany({
            skip: skip,//Này chính là offset trong SQL
            take: pageSize, //Số lượng sản phẩm trên mỗi trang ,này chính là limit trong SQL
            where: whereClause, //Điều kiện lọc sản phẩm
            orderBy: orderByClause, //Sắp xếp sản phẩm theo giá trị tăng dần hoặc giảm dần
        }),
        prisma.product.count({
            where: whereClause //Đếm số lượng sản phẩm
        })
    ]);

    const totalPages = Math.ceil(count / pageSize);
    return { products, totalPages }; //Trả về danh sách sản phẩm và tổng số trang

}

export { userFilter, yeuCau1, yeuCau2, yeuCau3, yeuCau4, yeuCau5, yeuCau6, yeuCau7, yeuCau8, getProductWithFilter };