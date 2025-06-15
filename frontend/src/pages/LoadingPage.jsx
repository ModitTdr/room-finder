
import { Spinner } from '../components/ui/spinner';
const LoadingPage = () => {
   return (
      <div className="flex items-center gap-3 justify-center h-screen text-2xl">
         <Spinner size="medium">Loading...</Spinner>
      </div>
   )
}

export default LoadingPage