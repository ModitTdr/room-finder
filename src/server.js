import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

import userRoute from "./routing/userRoutes.js"
import authRoute from "./routing/authRoutes.js"
import roomRoute from "./routing/roomRoutes.js"
import recommendation from "./routing/recommendation.js"
import review from "./routing/reviewRoutes.js"
import bookingRoute from "./routing/bookingRoutes.js"
import adminRoute from "./routing/adminRoutes.js"

const app = express();
const PORT = process.env.PORT || 3000;

//middlewares
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(cookieParser());

//routing
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/rooms', roomRoute);
app.use('/app/recommendation', recommendation);
app.use('/api/reviews', review);
app.use('/api/bookings', bookingRoute);
app.use('/api/admin', adminRoute);
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`)
})
