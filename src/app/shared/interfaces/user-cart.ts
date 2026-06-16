export interface UserCart {
    cart_id:string
    color:string
    country:string
    date:string
    id:number
    price: string
    currency:string
    product: 
    {
        brand:string
        category:string
        id:number
        image:string
        price:string
        product_rating:number
        rating:number
        rating_count:number
        slug:string
        title:string
        views:number
    }
    qty: number
    service_fee: string
    shipping_amount: string
    size: string
    sub_total: string
    tax_fee: string
    total: string
    user: number
}
