// order details in user dashboard
export interface OrderDetails {
  id: number
  orderitem: Orderitem[]
  payment_status: string
  order_status: string
  sub_total: string
  shipping_amount: string
  tax_fee: string
  service_fee: string
  total: string
  initial_total: string
  saved: string
  full_name: string
  email: string
  mobile: string
  address: any
  city: any
  state: any
  country: any
  currency: any
  stripe_session_id: any
  cart_order_id: any
  oid: string
  date: string
  buyer: Buyer2
  vendor: Vendor4[]
}

export interface Orderitem {
  id: number
  qty: number
  color?: string
  size?: string
  price: string
  currency: any
  country: any
  sub_total: string
  shipping_amount: string
  tax_fee: string
  service_fee: string
  total: string
  initial_total: string
  saved: string
  oid: string
  date: string
  vendor: Vendor
  order: Order
  product: Product
  coupon: any[]
}

export interface Vendor {
  id: number
  name_en: string
  name_ar: string
  description_en: string
  description_ar: string
  image: string
  email: any
  mobile: any
  activate: boolean
  date: string
  slug: string
  user: User
}

export interface User {
  id: number
  password: string
  last_login: any
  is_superuser: boolean
  first_name: string
  last_name: string
  is_staff: boolean
  is_active: boolean
  date_joined: string
  username: string
  email: string
  full_name: string
  phone: string
  otp: any
  groups: any[]
  user_permissions: any[]
}

export interface Order {
  id: number
  sub_total: string
  shipping_amount: string
  tax_fee: string
  service_fee: string
  total: string
  payment_status: string
  order_status: string
  initial_total: string
  saved: string
  full_name: string
  email: string
  mobile: string
  address: any
  city: any
  state: any
  country: any
  currency: any
  stripe_session_id: any
  cart_order_id: any
  oid: string
  date: string
  buyer: Buyer
  vendor: Vendor2[]
}

export interface Buyer {
  id: number
  password: string
  last_login: string
  is_superuser: boolean
  first_name: string
  last_name: string
  is_staff: boolean
  is_active: boolean
  date_joined: string
  username: string
  email: string
  full_name: string
  phone: any
  otp: any
  groups: any[]
  user_permissions: any[]
}

export interface Vendor2 {
  id: number
  name_en: string
  name_ar: string
  description_en: string
  description_ar: string
  image: string
  email: any
  mobile: any
  activate: boolean
  date: string
  slug: string
  user: User2
}

export interface User2 {
  id: number
  password: string
  last_login: any
  is_superuser: boolean
  first_name: string
  last_name: string
  is_staff: boolean
  is_active: boolean
  date_joined: string
  username: string
  email: string
  full_name: string
  phone: string
  otp: any
  groups: any[]
  user_permissions: any[]
}

export interface Product {
  id: number
  image: string
  price_EGP: string
  price_AED: string
  old_price: string
  shipping_amount: string
  stock_qty: number
  in_stock: boolean
  status: string
  featured: boolean
  views: number
  rating: number
  pid: string
  slug: string
  date: string
  category: Category
  brand: Brand
  vendor: Vendor3
  title: string
  description: string
}

export interface Category {
  id: number
  image: string
  active: boolean
  slug: string
  title: string
}

export interface Brand {
  id: number
  image: string
  slug: string
  title: string
}

export interface Vendor3 {
  id: number
  name_en: string
  name_ar: string
  description_en: string
  description_ar: string
  image: string
  email: any
  mobile: any
  activate: boolean
  date: string
  slug: string
  user: User3
}

export interface User3 {
  id: number
  password: string
  last_login: any
  is_superuser: boolean
  first_name: string
  last_name: string
  is_staff: boolean
  is_active: boolean
  date_joined: string
  username: string
  email: string
  full_name: string
  phone: string
  otp: any
  groups: any[]
  user_permissions: any[]
}

export interface Buyer2 {
  id: number
  password: string
  last_login: string
  is_superuser: boolean
  first_name: string
  last_name: string
  is_staff: boolean
  is_active: boolean
  date_joined: string
  username: string
  email: string
  full_name: string
  phone: any
  otp: any
  groups: any[]
  user_permissions: any[]
}

export interface Vendor4 {
  id: number
  name_en: string
  name_ar: string
  description_en: string
  description_ar: string
  image: string
  email: any
  mobile: any
  activate: boolean
  date: string
  slug: string
  user: User4
}

export interface User4 {
  id: number
  password: string
  last_login: any
  is_superuser: boolean
  first_name: string
  last_name: string
  is_staff: boolean
  is_active: boolean
  date_joined: string
  username: string
  email: string
  full_name: string
  phone: string
  otp: any
  groups: any[]
  user_permissions: any[]
}



