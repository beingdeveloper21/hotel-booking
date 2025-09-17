
// import "dotenv/config";
// import express from 'express'
// import cors from "cors";
// import connectDB from './configs/db.js';
// import { clerkMiddleware } from '@clerk/express'
// import clerkWebhooks from './controllers/clerkWebhooks.js';
// import userRouter from './routes/userRoutes.js';
// import hotelRouter from './routes/hotelRoutes.js';
// import connectCloudinary from "./configs/cloudinary.js"
// import roomRouter from './routes/roomRoutes.js';
// import bookingRouter from './routes/bookingRoutes.js';
// import { stripeWebhooks } from "./controllers/stripeWebhooks.js";

// connectDB()
// connectCloudinary()
// const app=express()
// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true
// })); //Enables cross-origin Resource Sharing

// //API to listen Stripe Webhooks
// app.post('/api/stripe', express.raw({type:"application/json"}),stripeWebhooks);

// //Middleware
// app.use(express.json())
// app.use(clerkMiddleware())

// //API to liten ClerkWebhooks
// app.post("/api/clerk/webhooks", express.json({ type: "*/*" }), clerkWebhooks);

// app.get('/',(req,res)=>res.send("API is Working"))
// app.use('/api/user',userRouter)
// app.use('/api/hotels',hotelRouter)
// app.use('/api/rooms',roomRouter)
// app.use('/api/bookings',bookingRouter)
// const PORT = process.env.PORT || 3000;

// app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));


import { clerkMiddleware } from '@clerk/express';
import cors from "cors";
import "dotenv/config";
import express from 'express';
import connectCloudinary from "./configs/cloudinary.js";
import connectDB from './configs/db.js';
import clerkWebhooks from './controllers/clerkWebhooks.js';
import { stripeWebhooks } from "./controllers/stripeWebhooks.js";
import bookingRouter from './routes/bookingRoutes.js';
import hotelRouter from './routes/hotelRoutes.js';
import roomRouter from './routes/roomRoutes.js';
import userRouter from './routes/userRoutes.js';

connectDB()
connectCloudinary()
const app = express()
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
})); //Enables cross-origin Resource Sharing

//API to listen Stripe Webhooks
app.post('/api/stripe', express.raw({ type: "application/json" }), stripeWebhooks);

//API to listen ClerkWebhooks
app.post("/api/clerk/webhooks", express.raw({ type: "application/json" }), clerkWebhooks);

//Middleware
app.use(express.json())
app.use(clerkMiddleware())

app.get('/', (req, res) => res.send("API is Working"))
app.use('/api/user', userRouter)
app.use('/api/hotels', hotelRouter)
app.use('/api/rooms', roomRouter)
app.use('/api/bookings', bookingRouter)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
