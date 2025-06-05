import userService from "../services/userService.js";
import bcrypt from "bcrypt"

const validateUserInput = async (userInput,userId=null,isUpdate=false,isAdmin=false) =>{

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const sanitizedInput = {}
    
    Object.keys(userInput).forEach(key => {
        if(typeof userInput[key] === "string"){
            sanitizedInput[key] = userInput[key].trim()
        }else{
            sanitizedInput[key] = userInput[key]
        }
    });
    let {firstname,lastname,email,password,address,phone,newpassword} = sanitizedInput;

    if(isUpdate){
        if(!isAdmin){
            if(!password){
                return { valid: false, message: "Password is required to confirm changes" };
            }else{
                try{
                    const userData = await userService.getUserByIdService(userId);
                    if(!userData) return { valid: false, message: "Invalid user ID provided" };
                    const match = await bcrypt.compare(password, userData.password);
                    if(!match)  return { valid: false, message: "Invalid password" };
                }catch(error){
                    console.log(error);
                    return{valid: false, message:"Something went wrong"};
                }
            }
        }

        if (newpassword) {
            if (newpassword.length < 8) {
                return { valid: false, message: "New password must be at least 8 characters" };
            }
            sanitizedInput.password = newpassword;
        }
        delete sanitizedInput.newpassword;
    } else{
        if(!firstname || !lastname || !email || !password || !address || !phone)
            return { valid: false, message:"All fields are required"};

        if(password && password.length < 8){
            return { valid: false, message: "Password must be at least 8 characters" };
        }
    }

    if(firstname && lastname){
        const letterOnlyRegex = /^[a-zA-Z]+$/;
        if(!letterOnlyRegex.test(firstname) || !letterOnlyRegex.test(lastname)){
            return { valid: false, message: "Name should only contain letters" };
        }

        firstname = firstname.charAt(0).toUpperCase() + firstname.slice(1).toLowerCase();
        lastname = lastname.charAt(0).toUpperCase() + lastname.slice(1).toLowerCase();
        sanitizedInput.name = `${firstname} ${lastname}`;

        delete sanitizedInput.firstname;
        delete sanitizedInput.lastname;
    }else if(firstname || lastname){
        return { valid: false, message: "Both first and last names are required to update the name" };
    }

    if(email){
        if (!emailRegex.test(email))
            return { valid: false, message: "Invalid email format" };
        try{
            const existingEmail = await userService.getUserByEmailService(email);
            if (existingEmail && existingEmail.id != userId) 
                return { valid: false, message: "Email already registered" };
        }catch(error){
            console.log(error);
            res.status(500).json({message:"Something went wrong"});
        }
    }

    if(phone){
        if(phone.length !== 10)
             return { valid: false, message: "Phone number must be 10 digits" };
        
        try{
            const existingPhone = await userService.getUserByPhoneService(phone);
            if (existingPhone && existingPhone.id != userId) 
                return { valid: false, message: "Phone number already registered" };   
        }catch(error){
            console.log(error);
            res.status(500).json({message:"Something went wrong"});
        }
        
        sanitizedInput.phone = phone;
    }
    
    return {
        valid: true,
        message: "All data are validated",
        validatedData: sanitizedInput,
    }
}

export default validateUserInput;