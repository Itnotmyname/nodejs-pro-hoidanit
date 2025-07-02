//const express = require("express");
import express from "express";
import 'dotenv/config' //Cú pháp dành cho Ts khi muốn chạy lệnh process.env.PORT
// require('dotenv').config() //Cú pháp dành cho Js khi muốn chạy lệnh process.env.PORT
import webRoutes from "./routes/web";

const app = express();
const PORT = process.env.PORT || 8080;

//template (config) view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views'); //__dirname là đường link thư mục tuyệt đối + /views là tên thư mục con của thư mục src có chứa home.ejs đển in ra lệnh Hello from ejs

//config req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Config routes
webRoutes(app);

//config static file
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`My app is running on port: ${PORT}`);
})
