import { type RouterOutputs } from "../utils";

export type Category = RouterOutputs["category"]["getAll"][number];
export type CategoryWithProducts =
  RouterOutputs["category"]["getAllWithProducts"][number];
