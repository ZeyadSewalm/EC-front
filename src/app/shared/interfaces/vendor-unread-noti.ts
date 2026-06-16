export interface VendorUnreadNoti {
        id: number
        seen: boolean
        date: string
        user: any
        vendor: Vendor
        order: Order
        order_item: OrderItem
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
        image: string
        name: string
        email: any
        description: string
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
      
      export interface OrderItem {
        id: number
        qty: number
        color: string
        size: string
        price: string
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
        vendor: Vendor3
        order: Order2
        product: Product
        coupon: any[]
      }
      
      export interface Vendor3 {
        id: number
        image: string
        name: string
        email: any
        description: string
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
      
      export interface Order2 {
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
        stripe_session_id: any
        cart_order_id: any
        oid: string
        date: string
        buyer: Buyer2
        vendor: Vendor4[]
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
        image: string
        name: string
        email: any
        description: string
        mobile: any
        activate: boolean
        date: string
        slug: string
        user: number
      }
      
      export interface Product {
        id: number
        title: string
        image: string
        description: string
        price: string
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
        vendor: Vendor5
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
      
      export interface Vendor5 {
        id: number
        image: string
        name: string
        email: any
        description: string
        mobile: any
        activate: boolean
        date: string
        slug: string
        user: number
      }
      
