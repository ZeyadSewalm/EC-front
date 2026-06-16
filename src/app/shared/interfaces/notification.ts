export interface Notification {
        id: number
        seen: boolean
        date: string
        user: User
        vendor: any
        order: Order
        order_item: any
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
        address: string
        city: string
        state: string
        country: string
        stripe_session_id: string
        cart_order_id: string
        oid: string
        date: string
        buyer: Buyer
        vendor: Vendor[]
      }
      
      export interface Buyer {
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
      
      export interface Vendor {
        id: number
        image: string
        name: string
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
      

