import { useQuery } from "@tanstack/react-query";
import { getAllUser } from "@/services/userServices";
import UserListTable from "./UserListTable";
import LoadingPage from "../../LoadingPage"

const AdminDashboard = () => {
  const {data,isLoading} = useQuery({
      queryKey: ["allusers"],
      queryFn: getAllUser,
  })
  if(isLoading){
    return <LoadingPage />
  }
  return (
    <div>
      AdminDashboard
      <UserListTable data={data.data}/>
      </div>
  )
}

export default AdminDashboard