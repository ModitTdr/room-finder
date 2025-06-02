import userService from "../services/userService.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateUserInput = async (userInput) => {
  let { name, email, password, phone, address } =userInput;

  
  // Trim and normalize input
  name = name.trim();
  email = email.trim().toLowerCase();
  phone = phone.trim();
  address = address.trim();
  
  if (!name || !email || !password || !phone || !address) {
    return { valid: false, message: "All fields required" };
  }

  if (!emailRegex.test(email)) {
    return { valid: false, message: "Invalid email format" };
  }

  if (await userService.getUserByEmailService(email)) {
    return { valid: false, message: "Email already registered" };
  }

  if (password.length < 6) {
    return { valid: false, message: "Password must be at least 6 characters" };
  }

  if (phone.length !== 10) {
    return { valid: false, message: "Phone number must be 10 digits" };
  }

  if (await userService.getUserByPhoneService(phone)) {
    return { valid: false, message: "Phone number already registered" };
  }

  return {
    valid: true,
    message: "All data are validated",
    sanitizedData: { name, email, password, phone, address },
  };
};

export default validateUserInput;