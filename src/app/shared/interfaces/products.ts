
export interface Products {
  id: number
  user: string
  date: string
  product: Product
}

export interface Product {
  id: number
  title: string
  image: string
  description: string
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
  vendor: Vendor
  price: number
  currency: string
}

export interface Category {
  id: number
  title: string
  image: string
  active: boolean
  slug: string
}

export interface Brand {
  id: number
  title: string
  image: string
  slug: string
}

export interface Vendor {
  id: number
  image: string
  name: string
  email: any
  description: string
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
