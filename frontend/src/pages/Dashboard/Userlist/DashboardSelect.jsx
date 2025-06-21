import { Label } from "@/components/ui/label"
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select"

const DashboardSelect = ({ title, icon: Icon, placeholder, options, value, onChange }) => {
   const isDisable = !Array.isArray(options) || options.length == 0
   return (
      <div className="flex items-center">
         <Icon className="opacity-85" size="18" />
         <Label className="text-base pl-1 pr-2 font-normal" htmlFor={title}>{title}</Label>
         <Select id={title} disabled={isDisable} value={value} onValueChange={onChange}>
            <SelectTrigger className="w-[180px]">
               <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
               {
                  options?.map((option) => (
                     <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))
               }
            </SelectContent>
         </Select>
      </div >
   )
}

export default DashboardSelect