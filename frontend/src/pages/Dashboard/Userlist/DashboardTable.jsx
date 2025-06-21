import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const DashboardTable = ({ data }) => {
   const tableHead = [
      {
         title: "Name"
      },
      {
         title: "Status"
      },
      {
         title: "Category"
      },
      {
         title: "Price"
      },
      {
         title: "Discount"
      },
      {
         title: "ListingDate"
      },
      {
         title: "Pictures"
      },
      {
         title: "Available Locations"
      },
      {
         title: "Description"
      }
   ]
   const tableData = data;
   return (
      <Table className="text-xs">
         <TableHeader>
            <TableRow className="bg-muted">
               <TableHead>
                  <div className='flex items-center gap-2'>
                     <Checkbox id="id" />
                     <Label className="text-xs text-neutral-600" htmlFor="id">S.No</Label>
                  </div>
               </TableHead>
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
                  const { id, name, status, category, price, discount, listingdate, pictures, loactions, description } = data;
                  return (
                     <TableRow key={id}>
                        <TableCell>
                           <div className='flex items-center gap-2'>
                              <Checkbox id="id" />
                              <Label className="text-xs font-normal" htmlFor="id">{id}</Label>
                           </div>
                        </TableCell>
                        <TableCell className="min-w-[120px]">{name}</TableCell>
                        <TableCell>
                           <button className={`p-1 px-2 w-[60px] rounded-md text-background ${status === 'Active' ? 'bg-green-600' : 'bg-red-700'}`}>
                              {status}
                           </button>
                        </TableCell>
                        <TableCell className="min-w-[90px]">{category}</TableCell>
                        <TableCell>{price}</TableCell>
                        <TableCell className="">{discount}</TableCell>
                        <TableCell>{listingdate}</TableCell>
                        <TableCell>{pictures}</TableCell>
                        <TableCell className='whitespace-break-spaces'>{loactions}</TableCell>
                        <TableCell className='whitespace-break-spaces'>
                           <p className="min-w-[100px] line-clamp-2">{description}</p>
                        </TableCell>
                     </TableRow>
                  )
               })
            }
         </TableBody>
      </Table>
   )
}
export default DashboardTable