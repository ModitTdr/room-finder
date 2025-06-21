import {
   Pagination,
   PaginationContent,
   PaginationEllipsis,
   PaginationItem,
   PaginationLink,
} from "@/components/ui/pagination"
import { ChevronLeft, ChevronRight } from "lucide-react"



const DashboardPagination = ({ handleNext, handlePrev, currentPage, totalPage }) => {
   const pages = []
   for (let i = 0; i <= totalPage; i++) {
      pages.push(i);
   }

   return (
      <Pagination>
         <PaginationContent>
            <PaginationItem>
               <PaginationLink href="#" onClick={handlePrev}><ChevronLeft /></PaginationLink>
            </PaginationItem>
            {
               pages.map((page) => (
                  <PaginationItem>
                     <PaginationLink href="#" onClick={handlePrev} className={`${page + 1 === currentPage ? 'bg-purple-400' : ''}`}>
                        {page + 1}
                     </PaginationLink>
                  </PaginationItem>
               ))
            }
            <PaginationItem>
               <PaginationLink href="#" onClick={handleNext}><ChevronRight /></PaginationLink>
            </PaginationItem>
         </PaginationContent>
      </Pagination>
   )
}

export default DashboardPagination