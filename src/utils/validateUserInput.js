import userService, { getUserByIdService } from "../services/userService.js";
import bcrypt from "bcrypt"

const validateUserInput = async (userInput,userId=null,isUpdate=false) =>{

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const sanitizedInput = {}
    
    Object.keys(userInput).forEach(key => {
        if(typeof userInput[key] === "string"){
            sanitizedInput[key] = userInput[key].trim()
        }else{
            sanitizedInput[key] = userInput[key]
        }
    });
    const {name,email,password,address,phone,newpassword} = sanitizedInput;

    if(isUpdate){
        if(!password){
            return { valid: false, message: "Password is required to confirm changes" };
        }else{
            const userData = await getUserByIdService(userId);
            const match = await bcrypt.compare(password, userData.password);
            if(!match){
                return { valid: false, message: "Your password doesn't match" };
            }
        }
        if (newpassword) {
            if (newpassword.length < 8) {
                return { valid: false, message: "New password must be at least 6 characters" };
            }
        }
    }else{
        if(!name || !email || !password || !address || !phone)
            return { valid: false, message:"All fields are required"};

        if(password && password.length < 8){
            return { valid: false, message: "Password must be at least 6 characters" };
        }
    }

    if(email){
        if (!emailRegex.test(email))
            return { valid: false, message: "Invalid email format" };

        const existingEmail = await userService.getUserByEmailService(email);
        if (existingEmail && existingEmail.id != userId) 
            return { valid: false, message: "Email already registered" };
    }

    if(phone){
        if(phone.length !== 10)
             return { valid: false, message: "Phone number must be 10 digits" };
        
        const existingPhone = await userService.getUserByPhoneService(phone);
        if (existingPhone && existingPhone.id != userId) 
            return { valid: false, message: "Phone number already registered" };

        sanitizedInput.phone = phone;
    }
    
    return {
        valid: true,
        message: "All data are validated",
        validatedData: sanitizedInput,
    }
}

export default validateUserInput;