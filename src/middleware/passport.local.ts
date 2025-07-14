import { prisma } from "config/client";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local"; //Xem bài 107 để xem tại sao và trường hợp 2 thư viện đều xuất ra cùng 1 function
import { getUserWithRoleById } from "services/client/auth.service";
import { comparePassword } from "services/user.service";



const configPassportLocal = () => {
    passport.use(new LocalStrategy({
        passReqToCallback: true              //Xem bài 108 để hiểu về cách thay vì cứ username ta có thể ghi đè thành email hoặc gì cũng được
        //Xem bài 110 phút 9 để hiểu tại sao lại có passReqToCallback và req ở dưới
    }, async function verify(req, username, password, callback) {
        console.log("check username/password: ", username, password)
        const user = await prisma.user.findUnique({ //Xem bài 107 để biết lí do dùng Unique
            where: { username: username }
        })
        if (!user) {
            //throw error
            // throw new Error(`Username:${username} not found`);
            return callback(null, false, { message: `Username:${username} not found` });
            //Xem bài 107 để hiểu rõ tại sao lại có false ở trên dòng 52
        }

        //compare password
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            // throw new Error(`Invalid password`);
            return callback(null, false, { message: 'Invalid password' });
        }
        return callback(null, user as any);//Xem bài 107 để hiểu rõ hơn tại sao
        //Xem thêm bài 108 nữa
    }));
    passport.serializeUser(function (user: any, callback) { //Xem bài 109 
        //Tại bài 111 đã giải thích serializeUser là function logic mã hóa thông tin người dùng ,nhớ xem phút 17-18 trở đo
        callback(null, { id: user.id, username: user.username });

    });

    passport.deserializeUser(async function (user: any, callback) {
        //Tại bài 111 đã giải thích serializeUser là function logic giải mã thông tin mã hóa thông tin người dùng
        const { id, username } = user;
        //query xuống database
        const userInDatabase: any = await getUserWithRoleById(id)
        return callback(null, { ...userInDatabase }); //Dấu ... là toán tử copy và cụ thể là copy cái {id,username} ở ngay gần trên

    });

}
export default configPassportLocal;