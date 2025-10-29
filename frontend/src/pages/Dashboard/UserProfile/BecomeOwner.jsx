
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUser } from "@/services/userServices"
import { updateUser } from "@/services/userServices"
import { Link } from "react-router";
import { Button } from "@/components/ui/button"
import { ChevronLeft, HomeIcon } from "lucide-react";
import LoadingPage from "@/pages/LoadingPage"

const BecomeOwner = () => {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery({
    queryKey: ["userprofile"],
    queryFn: getUser,
  });
  const { mutateAsync: updateProfile, isPending } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toast.success("Request Sent");
      queryClient.invalidateQueries({ queryKey: ["userprofile"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Update Failed");
    },
  });

  if (isLoading) return <LoadingPage />

  if (user?.role === "OWNER") {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center gap-8">
        <h2
          className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-accent text-5xl md:text-5xl font-bold mb-2 leading-tight"
        >
          You are already Landlord
        </h2>
        <div className="space-x-6">
          <Link to="/dashboard">
            <Button className="cursor-pointer">
              <ChevronLeft />
              Go to Dashboard
            </Button>
          </Link>
          <Link to="/" >
            <Button className="cursor-pointer">
              <HomeIcon />
              Go to Homepage
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = () => {
    updateProfile({ requestedOwnerRole: "PENDING" })
  }

  return (
    <div className="py-8 container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="my-6">
        <h2 className="text-3xl font-bold">Become an Owner</h2>
        {
          !user?.isVerified && (
            <p className="text-muted-foreground">Please provide the following information to become an owner</p>
          )
        }
      </div>

      <div className="flex w-full justify-start mt-12">
        {
          user?.isVerified && user?.profile ? (
            user?.profile?.phone && user?.profile?.address ? (
              <Button className="bg-accent hover:bg-accent/90" onClick={handleSubmit}>
                {isPending ? "Sending Request" : "Send Request"}
              </Button>
            ) : (
              <div>Add a number and Address First</div>
            )
          ) : (
            <div className="flex flex-col items-start justify-center gap-4">
              <span className="text-2xl">Add a number and Address First</span>
              <Button><Link to="/dashboard/userprofile">Go to Profile</Link></Button>
            </div>
          )
        }

      </div>
    </div>
  )
};
export default BecomeOwner;
