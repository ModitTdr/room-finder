import { useState, useEffect } from 'react';
import { useOutletContext } from "react-router-dom";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import toast from 'react-hot-toast';

import { CalendarIcon, Check, UploadCloud } from "lucide-react";

// import UploadWidget from "@/components/UploadWidget"
import { updateUserProfile } from "@/services/userServices"
/* -------- shadcn components ------- */
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/* -------------- enums ------------- */
const Gender = {
    MALE: "MALE",
    FEMALE: "FEMALE",
    OTHER: "OTHER",
};

/* ------- validation schemas ------- */
const profileSchema = z.object({
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
    gender: z.nativeEnum(Gender).optional().nullable(),
    citizenshipID: z.string().optional(),
    citizenshipFrontImg: z.string().url("Must be a valid URL").nullable().optional(),
    citizenshipBackImg: z.string().url("Must be a valid URL").nullable().optional(),
    address: z.string().max(500, 'Address must be less than 500 characters').nullable().optional(),

    // Preferences
    preferredCity: z.string().max(100, 'Preferred city must be less than 100 characters').optional().nullable(),
    preferredArea: z.string().max(100, 'Preferred area must be less than 100 characters').optional().nullable(),
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
});

/* ----------- components ----------- */
const CitizenshipSection = ({ control }) => {
    const [frontImgPreview, setFrontImgPreview] = useState(null);
    const [backImgPreview, setBackImgPreview] = useState(null);

    useEffect(() => {
        return () => {
            if (frontImgPreview) URL.revokeObjectURL(frontImgPreview);
            if (backImgPreview) URL.revokeObjectURL(backImgPreview);
        };
    }, [frontImgPreview, backImgPreview]);

    return (
        <div className="space-y-6 border p-4 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-foreground">Citizenship Information</h3>
            <FormField
                control={control}
                name="citizenshipID"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Citizenship ID</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., 123456789" {...field} />
                        </FormControl>
                        <FormDescription>Your national identification number.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="citizenshipFrontImg"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                        <FormLabel>Citizenship Front Image</FormLabel>
                        <FormControl>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(event) => {
                                    const file = event.target.files && event.target.files[0];
                                    onChange(file);
                                    if (file) {
                                        setFrontImgPreview(URL.createObjectURL(file));
                                    } else {
                                        setFrontImgPreview(null);
                                    }
                                }}
                                {...fieldProps}
                            />
                        </FormControl>
                        <FormDescription>Upload the front side of your citizenship ID.</FormDescription>
                        <FormMessage />
                        {frontImgPreview && (
                            <div className="mt-2">
                                <p className="text-sm text-muted-foreground">Preview:</p>
                                <img src={frontImgPreview} alt="Citizenship Front Preview" className="max-w-xs h-auto rounded-md border border-gray-200" />
                            </div>
                        )}
                        {value instanceof File && !frontImgPreview && (
                            <p className="text-sm text-muted-foreground mt-2">Selected file: {value.name}</p>
                        )}
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="citizenshipBackImg"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                        <FormLabel>Citizenship Back Image</FormLabel>
                        <FormControl>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(event) => {
                                    const file = event.target.files && event.target.files[0];
                                    onChange(file);
                                    if (file) {
                                        setBackImgPreview(URL.createObjectURL(file));
                                    } else {
                                        setBackImgPreview(null);
                                    }
                                }}
                                {...fieldProps}
                            />
                        </FormControl>
                        <FormDescription>Upload the back side of your citizenship ID.</FormDescription>
                        <FormMessage />
                        {backImgPreview && (
                            <div className="mt-2">
                                <p className="text-sm text-muted-foreground">Preview:</p>
                                <img src={backImgPreview} alt="Citizenship Back Preview" className="max-w-xs h-auto rounded-md border border-gray-200" />
                            </div>
                        )}
                        {value instanceof File && !backImgPreview && (
                            <p className="text-sm text-muted-foreground mt-2">Selected file: {value.name}</p>
                        )}
                    </FormItem>
                )}
            />
        </div>
    );
};

const PreferencesSection = ({ control }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border p-4 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold col-span-full text-foreground">Preferences</h3>
            <FormField
                control={control}
                name="preferredCity"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Preferred City</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Kathmandu" {...field} />
                        </FormControl>
                        <FormDescription>Your preferred city for services/residence.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="preferredArea"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Preferred Area</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., New Road" {...field} />
                        </FormControl>
                        <FormDescription>Your preferred area within the city.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="minBudget"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Minimum Budget</FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                placeholder="e.g., 500"
                                {...field}
                                value={field.value || ''} // Convert null/undefined to empty string
                                onChange={e => field.onChange(e.target.value ? parseInt(e.target.value, 10) : null)}
                            />
                        </FormControl>
                        <FormDescription>Your minimum budget for services/residence.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="maxBudget"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Maximum Budget</FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                placeholder="e.g., 2000"
                                {...field}
                                value={field.value || ''} // Convert null/undefined to empty string
                                onChange={e => field.onChange(e.target.value ? parseInt(e.target.value, 10) : null)}
                            />
                        </FormControl>
                        <FormDescription>Your maximum budget for services/residence.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}

const UserProfile = () => {
    const queryClient = useQueryClient();
    const { user } = useOutletContext();
    const [message, setMessage] = useState(null);
    const [profilePicPreview, setProfilePicPreview] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [selected, setSelected] = useState(false);

    const { mutateAsync: updateProfile } = useMutation({
        mutationFn: updateUserProfile,
        onSuccess: () => {
            toast.success("Profile updated");
            queryClient.invalidateQueries({ queryKey: ["userprofile"] });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Update Failed");
        },
    });

    useEffect(() => {
        return () => {
            if (profilePicPreview && profilePicPreview.startsWith('blob:')) {
                URL.revokeObjectURL(profilePicPreview);
            }
        };
    }, [profilePicPreview]);

    const form = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            phone: "",
            profilePic: undefined,
            dateOfBirth: undefined,
            gender: undefined,
            citizenshipID: "",
            citizenshipFrontImg: undefined,
            citizenshipBackImg: undefined,
            address: "",
            preferredCity: "",
            preferredArea: "",
            maxBudget: null,
            minBudget: null,
        },
    });

    // Reset form when user data is available
    useEffect(() => {
        if (user?.profile) {
            const formData = {
                phone: user.profile.phone || "",
                profilePic: undefined,
                dateOfBirth: user.profile.dateOfBirth ? new Date(user.profile.dateOfBirth) : undefined,
                gender: user.profile.gender || "",
                citizenshipID: user.profile.citizenshipID || "",
                citizenshipFrontImg: undefined,
                citizenshipBackImg: undefined,
                address: user.profile.address || "",
                preferredCity: user.profile.preferredCity || "",
                preferredArea: user.profile.preferredArea || "",
                maxBudget: user.profile.maxBudget || null,
                minBudget: user.profile.minBudget || null,
            };
            form.reset(formData);
        }
    }, [user, form]);

    const onSubmit = async (values) => {
        try {
            const response = await updateProfile(values);
            if (
                response?.message === "Phone number already exists" ||
                response?.message === "Citizenship ID already exists"
            ) {
                setMessage(response.message);
                toast.error(response.message);
                return;
            }
            setMessage(null);
        } catch (error) {
        }
    };

    /* ---------- alert messgge --------- */
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    /* -------- location handling ------- */
    const address = form.watch("address");

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (address && !selected) {
                fetchAddressSuggestions(address).then((results) => {
                    setSuggestions(results);
                })
            }
        }, 500);
        return () => clearTimeout(delayDebounce);
    }, [address, selected])

    const handleSuggestionSelect = (value) => {
        form.setValue("address", value);
        setSelected(true);
        setSuggestions([]);
    };

    // Show loading state while user data is being fetched
    if (!user) {
        return (
            <div className="py-8 container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    return (
        <div className="py-8 container mx-auto px-4 sm:px-6 lg:px-8 relative ">
            {/* Topbar - Adjusted for better responsiveness */}
            <div className='flex flex-col sm:flex-row items-center gap-4 p-4 bg-red-300/30 rounded-lg shadow-md mb-8'>
                <Tooltip>
                    <TooltipTrigger>
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-muted-foreground/40 overflow-hidden flex-shrink-0 relative group">
                            <img
                                src={profilePicPreview || user?.profile?.profilePic || "/ktm.png"}
                                alt="Profile Picture"
                                loading="lazy"
                                className="w-full h-full rounded-full object-cover" />
                            <div className="absolute top-0 left-0 bg-black/50 w-full h-full flex justify-center items-center opacity-0 group-hover:opacity-100 cursor-pointer">
                                {/* <UploadWidget
                                    onUpload={async (url) => {
                                        setProfilePicPreview(url);
                                        form.setValue("profilePic", url);
                                        try {
                                            await updateUserProfile({ ...form.getValues(), profilePic: url }).unwrap();
                                            toast.success("Profile picture updated");
                                        } catch (error) {
                                            toast.error("Failed to update profile picture");
                                        }
                                    }}
                                >
                                    <UploadCloud size={24} />
                                </UploadWidget> */}
                            </div>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        {user?.profile?.profilePic ? 'Change Profile Image' : 'Upload Profile Image'}
                    </TooltipContent>
                </Tooltip>

                <div className="space-y-2 text-center sm:text-left">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{user?.name || "User Name"}</h1>
                    <div>
                        <p className="text-sm text-muted-foreground">Email: {user?.email || "N/A"}</p>
                        <p className="text-sm text-muted-foreground">Phone: {user?.profile?.phone || "N/A"}</p>
                        <p className="text-sm text-muted-foreground">Role: {user?.role || "N/A"}</p>
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-semibold mb-6 text-foreground">Edit Profile</h2>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border p-4 rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold col-span-full text-foreground">Basic Information</h3>
                        {/* Phone and Date of Birth */}
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., 9876543210" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dateOfBirth"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Date of Birth</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value || undefined}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                }
                                                initialFocus
                                                captionLayout="dropdown"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Address */}
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem className="relative">
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                setSelected(false);
                                            }}
                                            onBlur={() => {
                                                setTimeout(() => {
                                                    if (!selected) {
                                                        setSuggestions([]);
                                                    }
                                                }, 100);
                                            }}
                                            onFocus={() => {
                                                if (address && suggestions.length === 0) {
                                                    fetchAddressSuggestions(address).then((results) => {
                                                        setSuggestions(results);
                                                    });
                                                }
                                            }}
                                            placeholder="Start typing your address"
                                            autoComplete="off"
                                        />
                                    </FormControl>
                                    {suggestions.length > 0 && (
                                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto top-14">
                                            {suggestions.map((s, idx) => (
                                                <div
                                                    key={idx}
                                                    onClick={() => handleSuggestionSelect(s.formatted)}
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b border-gray-100 last:border-b-0 text-gray-800"
                                                >
                                                    {s.formatted}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Gender */}
                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel>Gender</FormLabel>
                                    <Select key={field.value} onValueChange={field.onChange} value={field.value || ""}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select your gender" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(Gender).map((genderOption) => (
                                                <SelectItem key={genderOption} value={genderOption}>
                                                    {genderOption.charAt(0).toUpperCase() + genderOption.slice(1).toLowerCase()}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>

                    {/* Preference Information */}
                    <PreferencesSection control={form.control} />

                    {/* Citizenship Information Section */}
                    <CitizenshipSection control={form.control} />
                    <button type='submit' className='fixed bottom-12 right-12 w-12 h-12 bg-green-400 rounded-full flex items-center justify-center shadow-lg hover:scale-105 smooth-transition cursor-pointer'>
                        <Check size={28} color="black" />
                    </button>
                </form>
            </Form>
        </div>
    );
};

export default UserProfile;