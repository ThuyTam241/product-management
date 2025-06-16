import type { Dayjs } from "dayjs";

export type Category =
  | "electronics"
  | "footwear"
  | "computers"
  | "audio"
  | "wearables"
  | "food"
  | "cameras"
  | "accessories"
  | "cosmetics"
  | "pharmaceuticals"
  | "nutrition"
  | "personal_care";

export type Status = "in_stock" | "out_of_stock";

export interface Product {
  readonly id: string;
  name: string;
  thumbnail?: string;
  quantity: number;
  provider: string;
  category: Category;
  price: number;
  expiredAt?: string | Dayjs;
  tags?: string[];
  status: Status;
}
