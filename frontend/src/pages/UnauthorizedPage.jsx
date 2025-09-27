import { Link } from "react-router";
import { Button } from "@/components/ui/button"
import { ChevronLeft, HomeIcon } from "lucide-react";
const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center gap-8">
      <h2
        className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-accent text-5xl md:text-5xl font-bold mb-2 leading-tight"
      >
        You are not authorized to access this page
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

export default UnauthorizedPage;