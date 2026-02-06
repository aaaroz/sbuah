import type z from "zod";
import { type RouterOutputs } from "../utils";
import { type orderItemReadSchema } from "@/lib/schemas/order/order-schema";

export type Orders = RouterOutputs["order"]["getAll"]["data"];
export type OrderItem = z.infer<typeof orderItemReadSchema>;
export type Order = RouterOutputs["order"]["getOne"];
