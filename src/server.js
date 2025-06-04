import express from "express"
import cors from "cors"

import userRoute from "./routing/userRoute.js"


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