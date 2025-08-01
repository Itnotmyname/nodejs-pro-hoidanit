import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken";
import 'dotenv/config';

const checkValidJWT = (req: Request, res: Response, next: NextFunction) => {
    const path = req.path;
    const whiteList = [         //Xem bài 176 phút 2 ,khai báo whiteList có nghĩa là ko phải check quyền ,ta muốn ko phải check endpoint của router API nào thì để vào đó
        "/add-product-to-cart",
        "/login"
    ]
    const isWhiteList = whiteList.some(route => route === path); //sử dụng some để trả ra true hoặc false để so sánh route có bằng path không
    if (isWhiteList === true) {
        console.log("run here", isWhiteList)
        next();
        return; //Trong TH này ,cần thêm return để thoát khỏi function và ko thực thi phần code tiếp theo bên dưới.Bởi vì next() chỉ đơn giản và đi tới middleware tiếp theo (chuyển đến req) chứ ko ngừng thực thi function hiện tại
    }
    console.log("isWhiteList: ", isWhiteList, path);

    const token = req.headers['authorization']?.split(' ')[1]; // Tức là khi chạy debug để xem trong ứng dụng Postman khi ấn send (ko cần phải ctrl +c như debug web )thì phần header trong req 
    console.log(req.headers);
    console.log(token)
    try { //xem phút 3:49 bài 175
        const dataDecoded: any = jwt.verify(token, process.env.JWT_SECRET)//Xem bài 175 phút 2:55
        req.user = {
            id: dataDecoded.id,
            username: dataDecoded.username,
            password: "",
            fullName: "",
            address: "",
            phone: "",
            accountType: dataDecoded.accountType,
            avatar: dataDecoded.avatar,
            roleId: dataDecoded.roleId,
            role: dataDecoded.role  //Xem phút 7:30 bài 176 để hiểu tại sao lại như này
            //Kiểm tra token lấy từ login của postman sau đó dán lên jwt.io để xem  (phút 9:12 bài 176)
        } //Xem kỹ bài 174 khoảng phút 12
        next(); //Sự dụng next vì sau khi middleware xong thì nó không biết làm gì nữa 
    } catch (error) {
        console.log(error) //Xem bài 175  phút 8:42
        res.status(401).json({
            data: null,
            message: "Token không hợp lệ(không truyền lên token hoặc token hết hạn rồi nhé hehehe)",
        })
    }




} //Xem bài 174 phút 15 . split (' ')[1] tức là sẽ tách dòng mã hóa từ khoảng trắng ra để phân biệt

export { checkValidJWT }