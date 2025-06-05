import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

import userRoute from "./routing/userRoutes.js"
import authRoute from "./routing/authRoutes.js"

const app = express();
const PORT = process.env.PORT || 3000;

//middlewares
app.use(express.json());
app.use(cors())
app.use(cookieParser());

//routing
app.use('/api/auth',authRoute);
app.use('/api/users',userRoute);

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`)
})