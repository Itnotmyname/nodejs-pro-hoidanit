//const express = require("express");
import express from "express";
import 'dotenv/config' //Cú pháp dành cho Ts khi muốn chạy lệnh process.env.PORT
// require('dotenv').config() //Cú pháp dành cho Js khi muốn chạy lệnh process.env.PORT
import webRoutes from "src/routes/web";
import initDatabase from "config/seed";
import passport from "passport";
import configPassportLocal from "src/middleware/passport.local";
import session from "express-session";
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { PrismaClient } from '@prisma/client';
import apiRoutes from "routes/api";
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8080;

//config cors .Nên khai báo trước các router như thế này
app.use(cors())

//template (config) view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views'); //__dirname là đường link thư mục tuyệt đối + /views là tên thư mục con của thư mục src có chứa home.ejs đển in ra lệnh Hello from ejs

//config req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//config static file: images/css/js 
app.use(express.static('public'));

//Config session
app.use(session({
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000 // ms ,chính xác thì đây là đang gia hạn thời gian hết hạn của cookie :7 ngày - 24 giờ -60 phút -60 giây ..
    },
    secret: 'đoán xem mật khẩu là gì nào',

    //Forces session save even if unchanged :Nếu mà sesion không thay đổi
    resave: false,

    //Saves unmodified sessions: Đối với người dùng chưa đăng nhập hoặc chưa có data người dùng
    saveUninitialized: false,
    store: new PrismaSessionStore(
        new PrismaClient(),
        {
            //Clear expired sessions every 1 day
            checkPeriod: 1 * 24 * 60 * 60 * 1000,  //ms
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        })
}));

//Config passport lib :(Phần này ở trên Config routes vì nguyên tắc code chạy từ trên xuống dưới mà phải chạy cái này trước-tức là muốn có sự hiện diện của thư viện trước)
app.use(passport.initialize()); //Câu lệnh của thư viện passport
app.use(passport.authenticate('session'));

configPassportLocal(); //Cần phải khai báo như thế này để cho nó biết được

//Config global  :Nhớ xem bài 113 phút 4:55 để hiểu tại sao viết middleware này trước passport
//middleware
app.use((req, res, next) => {
    res.locals.user = req.user || null; // Pass user object to all views
    next(); //Xem bài 121 để hiểu tại sao res.locals được chia sẻ data để sử dụng toàn cục mà ko phải khai báo tại phía controller 
});


//Config routes
webRoutes(app);

//api routes
apiRoutes(app);

//seeding data
initDatabase();


//handle 404 not found
app.use((req, res) => {
    res.render("status/404.ejs");
})

app.listen(PORT, () => {
    console.log(`My app is running on port: ${PORT}`);
})
