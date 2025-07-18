//Tại sao lại có chữ d trong file index.d.ts : Bởi vì d là data type ,nghĩa là file này hỗ trợ định nghĩa kiểu type thôi .Mục đích là tận dụng lại datatype của schema.prisma để không phải cứ khai báo kiểu type mãi được 
//Nhớ phải xem từ phút thứ 9 trở đi bài 115
//Nhớ xem bài 115 ở phút thứ 12:26 để hiểu tại sao role không nhận và cấu hình thế nào
import { Role, User as UserPrisma } from '@prisma/client'

declare global {
    namespace Express {
        interface User extends UserPrisma { //Xem bài 119 phút 9:20
            role?: Role  //Dấu ? ở sau có nghĩa là Optional có hay ko cũng ok
            sumCart?: number;//Để được gợi ý code (bài 121 phút 16)
        }
    }
}
