import { useEffect, useState } from "react"

import { Search, ListFilterPlus, Eye } from "lucide-react"

import DashboardTable from "./DashboardTable"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"


import DashboardSelect from "./DashboardSelect"
import { data as allData } from "../../../data.js"
import { Link } from "react-router"

function DashboardIndex() {
   const orders = ['Ascending', 'Decending'];
   const categories = ['Home Sewa', 'Beauty and Personal Sewa', 'Pet Sewa', 'Health Sewa', 'Tutoring Sewa'];

   // search
   const [search, setSearch] = useState('');
   // filters
   const [selectedCategory, setSelectedCategory] = useState('');
   const [selectedOrder, setSelectedOrder] = useState('');
   // pagination
   const [currentPage, setCurrentPage] = useState(1);
   const dataPerPage = 4;
   const dataCount = allData.length;
   const totalPage = Math.floor(dataCount / dataPerPage);
   const startIndex = (currentPage - 1) * dataPerPage;
   const endIndex = startIndex + dataPerPage;
   const currentPageData = allData.slice(startIndex, endIndex);
   const handleNext = () => { setCurrentPage(prev => prev + 1) }
   const handlePrev = () => { setCurrentPage(prev => prev - 1) }

   useEffect(() => { console.log(selectedOrder) }, [selectedOrder])
   useEffect(() => { console.log(selectedCategory) }, [selectedCategory])


   return (
      <div className="mx-4 my-8 h-[20px] text-neutral-600">
         {/* dashboard-title */}
         <div className="flex justify-between items-center">
            <p className="font-bold">My Sewa</p>
            <Button className="p-1 px-2 h-fit rounded">
               <Link to='/add-sewa'>+ Add Sewa</Link>
            </Button>
         </div>

         {/* dashboard body */}
         <div className="px-4 border rounded-xl my-4 py-4 box-shadow-md ">

            {/* dashboard-body top */}
            <div className="flex justify-between items-center flex-wrap gap-x-8 gap-y-4 mb-4">
               {/* search  */}
               <div className="flex flex-grow lg:flex-grow-0 md:min-w-[200px]">
                  <Input
                     placeholder="Sewa Search"
                     className="rounded-r-none h-8"
                  />
                  <button className="bg-purple-400 rounded-r-md px-3 flex justify-center items-center justify-center">
                     <Search className="size-4 text-background" />
                  </button>
               </div>

               {/* filters */}
               <div className="flex item-center gap-4 flex-wrap justify-between flex-grow lg:flex-grow-0">
                  <DashboardSelect
                     title="Show:"
                     icon={Eye}
                     placeholder="All Sewa"
                     options={categories}
                     value={selectedCategory}
                     onChange={setSelectedCategory} />
                  <DashboardSelect
                     title="Filter:"
                     icon={ListFilterPlus}
                     placeholder="Descending"
                     options={orders}
                     value={selectedOrder}
                     onChange={setSelectedOrder} />

               </div>
            </div>

            {/* dashboard-body table */}
            <div className="">
               <DashboardTable data={currentPageData} />
            </div>

         </div>


      </div>
   )
}

export default DashboardIndex