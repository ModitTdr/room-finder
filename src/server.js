import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

import userRoute from "./routing/userRoutes.js"
import authRoute from "./routing/authRoutes.js"
import roomRoute from "./routing/roomRoutes.js"
import recommendation from "./routing/recommendation.js"
import review from "./routing/reviewRoutes.js"

const app = express();
const PORT = process.env.PORT || 3000;

//middlewares
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", // frontend
  credentials: true,
}));
app.use(cookieParser());

//routing
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/rooms', roomRoute);
app.use('/app/recommendation', recommendation);
app.use('/api/reviews', review);
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`)
})