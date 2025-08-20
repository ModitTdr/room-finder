
import { Spinner } from '../components/ui/spinner';
const LoadingPage = () => {
  return (
    <div className="flex items-center gap-3 justify-center h-[calc(100vh-69px)] text-2xl">
      <Spinner size="medium">Loading...</Spinner>
    </div>
  )
}

export default LoadingPage
