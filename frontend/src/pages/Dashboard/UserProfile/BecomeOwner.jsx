import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { IdCard, Check, UploadCloud } from "lucide-react";

/* shadcn components */
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
import UploadWidget from "@/components/UploadWidget";
import { updateUserProfile } from "@/services/userServices"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useOutletContext } from "react-router";
import { useEffect } from "react";
import MissingPage from "../../MissingPage";
/* -------- validation schema -------- */

const schema = z.object({
  citizenshipID: z.string().min(1, "Citizenship ID is required"),
  citizenshipFrontImg: z.string().url("Must be a valid URL").min(1, "Front image is required"),
  citizenshipBackImg: z.string().url("Must be a valid URL").min(1, "Back image is required"),
});

/* --------- Citizenship Section --------- */
const CitizenshipSection = ({ control }) => {

  return (
    <div className="gap-6 p-8 rounded-lg border-border/50 bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl space-y-8">
      <div className="overflow-hidden space-y-1">
        <div className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-accent/10 rounded-lg">
            <IdCard className="h-5 w-5 text-accent" />
          </div>
          Citizenship Information
        </div>
        <p className="text-sm text-muted-foreground">
          Provide or update details about your nationality and country of
          residence.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Citizenship ID */}
        <FormField
          control={control}
          name="citizenshipID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Citizenship ID</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., 123456789" {...field}
                  className="max-w-[400px]"
                />
              </FormControl>
              <FormDescription>
                Your national identification number.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Citizenship Front Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <FormField
            control={control}
            name="citizenshipFrontImg"
            render={({ field: { value, onChange } }) => (
              <FormItem>
                <FormLabel>Citizenship Front Image</FormLabel>
                <FormControl>
                  <div className="w-full max-w-xs rounded-lg border border-dashed border-muted-foreground/40 overflow-hidden relative group aspect-[4/3]">
                    <img
                      src={value || "/placeholder-front.png"}
                      alt="Citizenship Front"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex justify-center items-center opacity-0 group-hover:opacity-100 cursor-pointer">
                      <UploadWidget
                        onUpload={async (url) => {
                          onChange(url);
                        }}
                      >
                        <UploadCloud size={28} className="text-white" />
                      </UploadWidget>
                    </div>
                  </div>
                </FormControl>
                <FormDescription>
                  Upload the front side of your citizenship ID.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Citizenship Back Image */}
          <FormField
            control={control}
            name="citizenshipBackImg"
            render={({ field: { value, onChange } }) => (
              <FormItem>
                <FormLabel>Citizenship Back Image</FormLabel>
                <FormControl>
                  <div className="w-full max-w-xs rounded-lg border border-dashed border-muted-foreground/40 overflow-hidden relative group aspect-[4/3]">
                    <img
                      src={value || "/placeholder-back.png"}
                      alt="Citizenship Back"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex justify-center items-center opacity-0 group-hover:opacity-100 cursor-pointer">
                      <UploadWidget
                        onUpload={async (url) => {
                          onChange(url);
                        }}
                      >
                        <UploadCloud size={28} className="text-white" />
                      </UploadWidget>
                    </div>
                  </div>
                </FormControl>
                <FormDescription>
                  Upload the back side of your citizenship ID.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

/* --------- Main Component --------- */
const BecomeOwner = () => {
  const queryClient = useQueryClient();
  const { user } = useOutletContext();
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

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      citizenshipID: "",
      citizenshipFrontImg: null,
      citizenshipBackImg: null,
    },
  });

  useEffect(() => {
    if (user?.profile) {
      const formData = {
        citizenshipID: user.profile.citizenshipID || undefined,
        citizenshipFrontImg: user.profile.citizenshipFrontImg || undefined,
        citizenshipBackImg: user.profile.citizenshipBackImg || undefined,
      };
      form.reset(formData);
    }
  }, [user, form]);

  const onSubmit = async (values) => {
    const submitData = {
      ...values,
      citizenshipStatus: "PENDING"
    };
    const response = await updateProfile(submitData);
    if (
      response?.message === "Phone number already exists" ||
      response?.message === "Citizenship ID already exists"
    ) {
      toast.error(response.message);
      return;
    }
  };

  const citizenshipStatus = user?.profile?.citizenshipStatus;

  if (citizenshipStatus === "PENDING") {
    return (
      <MissingPage title="Your citizenship is being verified" />
    );
  } else if (citizenshipStatus === "VERIFIED") {
    return (
      <MissingPage title="You are already an owner" />
    );
  }

  return (
    <div className="py-8 container mx-auto px-4 sm:px-6 lg:px-8 ">
      <div className="my-6">
        <h2 className="text-3xl font-bold">Become an Owner</h2>
        <p className="text-muted-foreground">Please provide the following information to become an owner</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CitizenshipSection control={form.control} />
          <button
            type="submit"
            className="fixed bottom-12 right-12 w-12 h-12 bg-green-400 rounded-full flex items-center justify-center shadow-lg hover:scale-105 smooth-transition cursor-pointer"
          >
            <Check size={28} color="black" />
          </button>
        </form>
      </Form>
    </div>
  );
};

export default BecomeOwner;
