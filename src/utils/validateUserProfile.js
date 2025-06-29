import { z } from "zod";

const Gender = z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']);

export const userProfileSchema = z.object({
    address: z.string().min(1, "Address cannot be empty").nullable().optional(),
    phone: z.string()
        .regex(/^(\+977)?[9][6-9]\d{8}$/, 'Invalid number format')
        .nullable()
        .optional(),
    profilePic: z.string().url('Invalid profile picture URL').optional().nullable(),
    dateOfBirth: z.date()
        .max(new Date(), 'Date of birth cannot be in the future')
        .refine(date => {
            const age = new Date().getFullYear() - date.getFullYear();
            return age >= 16;
        }, 'Age must be between at least 16')
        .optional()
        .nullable(),
    gender: Gender.optional().nullable(),
    citizenshipID: z.string().optional(),
    citizenshipFrontImg: z.string().url("Must be a valid URL").optional(),
    citizenshipBackImg: z.string().url("Must be a valid URL").optional(),
    address: z.string().max(500, 'Address must be less than 500 characters').optional().nullable(),

    // Preferences
    preferredCity: z.string().max(100, 'Preferred city must be less than 100 characters').optional().nullable(),
    preferredArea: z.string().max(100, 'Preferred area must be less than 100 characters').optional().nullable(),
    latitude: z.number()
        .min(-90, 'Latitude must be between -90 and 90')
        .max(90, 'Latitude must be between -90 and 90')
        .optional()
        .nullable(),
    longitude: z.number()
        .min(-180, 'Longitude must be between -180 and 180')
        .max(180, 'Longitude must be between -180 and 180')
        .optional()
        .nullable(),
    maxBudget: z.number()
        .int('Max budget must be an integer')
        .positive('Max budget must be positive')
        .max(1000000, 'Max budget seems unrealistic')
        .optional()
        .nullable(),
    minBudget: z.number()
        .int('Min budget must be an integer')
        .positive('Min budget must be positive')
        .max(1000000, 'Min budget seems unrealistic')
        .optional()
        .nullable(),

}).refine(data => {
    if (data.minBudget && data.maxBudget) {
        return data.minBudget <= data.maxBudget;
    }
    return true;
}, {
    message: 'Minimum budget cannot be greater than maximum budget',
    path: ['minBudget']
});