import { prisma } from "config/client";
import { TOTAL_ITEMS_PER_PAGE } from "config/constant";

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

const getProductList = async (page: number) => {
    const pageSize = TOTAL_ITEMS_PER_PAGE; //Số lượng user hiển thị trên mỗi trang ,xem bài 139 phút 02:30
    const skip = (page - 1) * pageSize; //Tính toán số lượng bản ghi cần bỏ qua dựa trên trang hiện tại
    const products = await prisma.product.findMany({
        skip: skip, //Bỏ qua số lượng bản ghi đã tính toán .Đây chính là Offset trong SQL
        take: pageSize, //Lấy số lượng bản ghi theo kích thước trang .Đây chính là Limit trong SQL
    });
    return products;

}

const countTotalProductPages = async () => {
    const pageSize = TOTAL_ITEMS_PER_PAGE; //Số lượng product hiển thị trên mỗi trang ,xem bài 139 phút 02:30
    const totalItems = await prisma.product.count(); //Lấy tổng số bản ghi trong bảng product

    const totalPages = Math.ceil(totalItems / pageSize); //Tính toán tổng số trang dựa trên tổng số bản ghi và kích thước trang và hàm Math.ceil để làm tròn lên
    return totalPages;
}

const handleDeleteProduct = async (id: number) => {
    await prisma.product.delete({
        where: { id }   //Xoá sản phẩm theo id ,bạn có thể viết là { id: id } hoặc { id } đều được, vì id là biến cùng tên với thuộc tính id trong database
    });
}

const getProductById = async (id: number) => {
    return await prisma.product.findUnique({
        where: { id }
    });
}

const updateProductById = async (
    id: number,
    name: string,
    price: number,
    detailDesc: string,
    shortDesc: string,
    quantity: number,
    factory: string,
    target: string,
    imageUpload: string) => {
    await prisma.product.update({
        where: { id: +id }, //Mẹo dùng +id để convert id từ string sang number(int) chỉ áp dụng cho javascript
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

export { createProduct, getProductList, handleDeleteProduct, getProductById, updateProductById, countTotalProductPages };
