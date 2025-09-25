// import stripe from "stripe";
// import Booking from "../models/Booking.js";
// //API to handle stripe webhooks

// export const stripeWebhooks=async(request,response)=>{
//     //Stripe Gateway Initialize
//     const stripeInstance=new stripe(process.env.STRIPE_SECRET_KEY);
//     const sig=request.headers['stripe-signature'];
//     let event;
//     try{
//         event=stripeInstance.webhooks.constructEvent(request.body,sig,process.env.STRIPE_WEBHOOK_SECRET)
//     }
//     catch(error){
//        response.status(400).send(`Webhook Error: ${err.message}`)
//     }
//     //Handle the event
//     if(event.type === "payment_intent.succeeded"){
//         const paymentIntent=event.data.object;
//         const paymentIntentId=paymentIntent.id;
//         //Getting Session Metadata
//         const session=await stripeInstance.checkout.sessions.list({
//             payment_intent:paymentIntentId
//         });
//         const {bookingId}=session.data[0].metadata;
//         //Mark Payment as Paid
//         await Booking.findByIdAndUpdate(bookingId,{isPaid:true,paymentMethod:"Stripe"})
//     }
//     else{
//         console.log("Unhandled event type:",event.type)
//     }
//     response.json({received:true});
// }
import Stripe from "stripe";
import Booking from "../models/Booking.js";

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

// API: Handle Stripe webhooks
export const stripeWebhooks = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body, // ⚠️ must be raw body (see routes)
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle completed checkout session
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const bookingId = session.metadata?.bookingId;
    if (bookingId) {
      await Booking.findByIdAndUpdate(bookingId, {
        isPaid: true,
        paymentMethod: "Stripe",
      });
      console.log(`✅ Booking ${bookingId} marked as paid.`);
    }
  } else {
    console.log("⚠️ Unhandled event type:", event.type);
  }

  res.json({ received: true });
};
