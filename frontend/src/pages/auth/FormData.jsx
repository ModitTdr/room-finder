import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const FormData = ({ label, id, type = "text", name, value, onChange, placeholder = "", required = true }) => {
   return (
      <div className="grid gap-3">
         {label && <Label htmlFor={id}>{label}</Label>}
         <Input
            id={id}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
         />
      </div>
   );
};

export default FormData;
