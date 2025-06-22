
import HeroSection from './HeroSection'
import MainSection from './MainSection'
import {
   Card,
   CardAction,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card"

const HomePage = () => {
   return (
      <div>
         <HeroSection />
         <MainSection />
      </div>
   )
}

export default HomePage