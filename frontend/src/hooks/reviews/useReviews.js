import { useMutation, useQueryClient } from "@tanstack/react-query";;
import { createReview, deleteReview } from "../../services/reviewServices";
import toast from "react-hot-toast";

export const useCreateReview = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: createReview,
      onSuccess: (data, variables) => {
         toast.success("Review added!");
         queryClient.invalidateQueries({ queryKey: ["room", variables.roomId] });
      },
      onError: (error) => {
         console.log(error)
         const errorMessage = error.response?.data?.message || "An error occurred while adding the review.";
         toast.error(errorMessage);
      },
   });
};

export const useDeleteReview = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: deleteReview,
      onSuccess: (_, variable) => {
         toast.success("Review deleted");
         queryClient.invalidateQueries({ queryKey: ["room", variable.roomId] });
      },
      onError: (error) => {
         const errorMessage = error.response?.data?.message || "An error occurred while adding the review.";
         toast.error(errorMessage);
      }
   })
}