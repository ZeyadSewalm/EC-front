export interface Details {
  id: number
  title: string
  image: string
  description: string
  category: string
  brand: string
  price: any
  currency: string
  old_price: string
  shipping_amount: string
  stock_qty: number
  in_stock: boolean
  status: string
  featured: boolean
  views: number
  rating: number
  vendor: string
  pid: string
  slug: string
  date: string
  gallery: Gallery[]
  specification: Specification[]
  size: Size[]
  color: Color[]
  product_rating: number
  rating_count: number
}

export interface Gallery {
  id: number
  image: string
  active: boolean
  date: string
  gid: string
  product: number
}

export interface Specification {
  id: number
  title: string
  content: string
}

export interface Size {
  id: number
  name: string
  price: string
  date: string
  product: number
}

export interface Color {
  id: number
  name: string
  color_code: string
  product: number
}
