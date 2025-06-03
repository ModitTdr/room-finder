import userService from "../services/userService.js";

const validateUserInput = async (userInput,userId=null) =>{

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const sanitizedInput = {}
    for (const key of Object.keys(userInput)) {
        const value = userInput[key]?.trim()

        //checking for empty fields
        if(!value)
            return { valid: false, message: "All fields required" };

        if (key === "email"){
          if (!emailRegex.test(value))
            return { valid: false, message: "Invalid email format" };
          
          const existingEmail = await userService.getUserByEmailService(value);
          if (existingEmail && existingEmail.id != userId) 
            return { valid: false, message: "Email already registered" };
        }

        if(key === "password" && value.length < 6) 
            return { valid: false, message: "Password must be at least 6 letters" };

        if(key === "phone") {
            if(value.length !== 10)
                return { valid: false, message: "Phone number must be 10 digits" };

            const existingPhone = await userService.getUserByPhoneService(value);
            if (existingPhone && existingPhone.id != userId) 
                return { valid: false, message: "Phone number already registered" };
        }
        sanitizedInput[key] = value;
    }
    return{
        valid:true,
        message: "All data are validated",
        validatedData: sanitizedInput
    }
}

export default validateUserInput;