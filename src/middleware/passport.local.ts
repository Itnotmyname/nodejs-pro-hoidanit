import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local"; //Xem bài 107 để xem tại sao và trường hợp 2 thư viện đều xuất ra cùng 1 function
import { handleLogin } from "services/client/auth.service";



const configPassportLocal = () => {
    passport.use(new LocalStrategy(function verify(username, password, callback) {
       console.log("check username/password: ",username,password)
        return handleLogin(username,password,callback)
    }));

}
export default configPassportLocal;