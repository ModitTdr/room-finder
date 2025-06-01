import express from "express"
import dotenv from "dotenv"
import cors from "cors"

import userRoute from "./routing/userRoute.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//middlewares
app.use(express.json());
app.use(cors())

//routing
app.use('/api/users',userRoute);

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`)
})