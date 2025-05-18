import orderModal from "../models/orderModel.js";
import userModal from "../models/userModel.js"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KRY)

// placing order for frontend
const placeOrder = async (req, res) => {


    const frontend_url = "http://localhost:5174";

    try {
        const newOrder = new orderModal({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address

        })

        await newOrder.save();
        await userModal.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const line_items = req.body.item.map((items) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100 * 80
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery charges"
                },
                unit_amount: 2 * 100 * 80
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancle_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        })

        res.json({ success: true, session_url: session.url })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })

    }

}

// users ordeer for fronend

const userOrders = async (req, res) => {

    try {
        const orders = await orderModal.find({ userId: req.body.userId })
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "error" })


    }

}
// listing order for admin panal

const listOrders = async (req, res) => {
    try {
        const orders = await orderModal.find({});
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });


    }
}
// api for updating order status

const updateStatus = async (req,res)=>{
    try {
       await orderModal.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
       res.json({success:true,message:"Status updated"}) 
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"error"})
        
        
    }

}

export { placeOrder, userOrders, listOrders,updateStatus }