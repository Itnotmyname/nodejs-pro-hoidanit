import { createUserAPI, deleteUserByIdAPI, getAllUsersAPI, getUserByIdAPI, postAddProductToCartAPI, updateUserByIdAPI } from 'controllers/client/api.controller';
import express, { Express } from 'express';

import { getAllUsers } from 'services/user.service';

const router = express.Router();

const apiRoutes = (app: Express) => {

    router.post("/add-product-to-cart", postAddProductToCartAPI);

    router.get("/users", getAllUsersAPI);
    router.get("/users/:id", getUserByIdAPI);
    router.post("/users", createUserAPI);

    router.patch("/users/:id", updateUserByIdAPI);

    router.delete("/users/:id", deleteUserByIdAPI)

    app.use("/api", router);
}

export default apiRoutes;