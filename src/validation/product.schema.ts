import { z } from "zod";

export const ProductSchema = z.object({
  id:z.string().optional(),
    name: z.string().trim().min(1, {message:"Tên không được để trống"}).max(255, {message:"Tên không được quá 255 ký tự "}),
    price: z.string()
    .transform((val) => (val === "" ? 0 : Number(val)))
    .refine((num) => num > 0, {
      message: "Số tiền tối thiểu là 1",
    }),

    detailDesc: z.string().trim().min(1,{message:"Phần mô tả chi tiết không được để trống"}).max(255,{message:"Phần mô tả chi tiết không được quá 255 ký tự "}),
    shortDesc: z.string().trim().min(1,{message:"Phần mô tả ngắn gọn không được để trống"}).max(255, {message:"Phần mô tả ngắn gọn không được quá 255 ký tự"}),
    quantity: z.string()
    .transform((val) => (val === "" ? 0 : Number(val)))
    .refine((num) => num > 0, {
      message: "Số lượng tối thiểu là 1",
    }),

    factory:z.string().trim().min(1,{message:"Công ty không được để trống"}),
    target: z.string().trim().min(1,{message:"Target không được để trống"}),

});

export type TProductSchema = z.infer<typeof ProductSchema>;