import {prisma} from "config/client";

const createProduct = async (
    name: string,
    price: number,
    detailDesc: string,
    shortDesc: string,
    quantity: number,
    factory: string,
    target: string,
    imageUpload: string) => {
    await prisma.product.create({
        data: {
            name: name,
            price: price,
            detailDesc: detailDesc,
            shortDesc: shortDesc,
            quantity: quantity,
            factory: factory,
            target: target,
            ...(imageUpload && { image: imageUpload }) //Nếu imageUplaod có giá trị thì mới thêm vào, nếu không thì sẽ không thêm vào
            //Tức là nếu imageUpload là một chuỗi không rỗng (truthly :có giá trị,...) thì sẽ thêm vào trường image, nếu là chuỗi rỗng hoặc undefined thì sẽ tính là false và toán tử AND sẽ xét tiếp vế còn lại và nếu vậy thì sẽ không thêm vào trường image 
        }
    });
}

const getProductList = async () => {
    return await prisma.product.findMany();
}

export { createProduct,getProductList };
