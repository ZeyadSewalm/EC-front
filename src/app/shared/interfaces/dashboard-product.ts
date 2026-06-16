export interface DashboardProduct {
  id: number;
  title: string;
  image: string;
  description: string;
  category: Category;
  price_AED: string;
  price_EGP: string;
  old_price: string;
  shipping_amount: string;
  stock_qty: number;
  in_stock: boolean;
  status: string;
  featured: boolean;
  views: number;
  rating: number;
  vendor: Vendor;
  pid: string;
  slug: string;
  date: string;
  gallery: Gallery[];
  specification: Specification[];
  size: Size[];
  color: Color[];
  product_rating: number;
  rating_count: number;
  orders: number;
}

export interface Category {
  id: number;
  title: string;
  image: string;
  active: boolean;
  slug: string;
}

export interface Vendor {
  id: number;
  image: string;
  name: string;
  email: any;
  description: string;
  mobile: any;
  activate: boolean;
  date: string;
  slug: string;
  user: User;
}

export interface User {
  id: number;
  password: string;
  last_login: any;
  is_superuser: boolean;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string;
  username: string;
  email: string;
  full_name: string;
  phone: string;
  otp: any;
  groups: any[];
  user_permissions: any[];
}

export interface Gallery {
  id: number;
  image: string;
  active: boolean;
  date: string;
  gid: string;
  product: number;
}

export interface Specification {
  id: number;
  title: string;
  content: string;
}

export interface Size {
  id: number;
  name: string;
  price: string;
  date: string;
  product: number;
}

export interface Color {
  id: number;
  name: string;
  color_code: string;
  product: number;
}
