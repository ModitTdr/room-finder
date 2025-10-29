import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"

import { Check, X } from "lucide-react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserByAdmin } from '@/services/userServices.js'
import toast from 'react-hot-toast';


const tableHead = [
  {
    title: "Name"
  },
  {
    title: "Email"
  },
  {
    title: "Phone"
  },
  {
    title: "Role"
  },
  // {
  //    title: "CitizenshipID"
  // },
  {
    title: "Status"
  },
]
const Roles = ['OWNER', "SEEKER", "ADMIN"]

const UserListTable = ({ data }) => {
  const queryClient = useQueryClient();
  const tableData = data;
  const mutation = useMutation({
    mutationFn: updateUserByAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries(["allusers"])
      toast.success('User updated successfully!');
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleRole = (value, id) => {
    mutation.mutate({ role: value, id: id })
  }


  return (
    <Table className="text-xs">
      <TableHeader>
        <TableRow className="bg-muted">
          {
            tableHead.map((head) => {
              const { title } = head;
              return (
                <TableHead key={title} className="text-neutral-600">{title}</TableHead>
              )
            })
          }
        </TableRow>
      </TableHeader>
      <TableBody>
        {
          tableData.map((data) => {
            const { id, name, email, role, profile, isVerified } = data;
            return (
              <TableRow key={id}>
                <TableCell className="min-w-[90px]">{name}</TableCell>
                <TableCell className="min-w-[90px]">{email}</TableCell>
                <TableCell className="min-w-[90px]">{profile?.phone ? profile.phone : "Not Available"}</TableCell>
                <TableCell>
                  <Select value={role} onValueChange={(value) => handleRole(value, id)}>
                    <SelectTrigger className="w-[120px]">
                      {role || "Select Role"}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OWNER">OWNER</SelectItem>
                      <SelectItem value="SEEKER">SEEKER</SelectItem>
                      <SelectItem value="ADMIN">ADMIN</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className={`rounded-full text-background w-fit p-0.5 ${isVerified ? 'bg-green-600' : 'bg-red-700'}`}>
                    {isVerified ? <Check size={16} /> : <X size={16} />}
                  </div>
                </TableCell>
              </TableRow>
            )
          })
        }
      </TableBody>
    </Table>
  )
}
export default UserListTable;
