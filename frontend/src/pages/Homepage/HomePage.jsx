import HeroSection from './HeroSection'
import MainSection from './MainSection'
import { useAuth } from "@/hooks/useAuth"
import useRecommendedRooms from "@/hooks/useRecommendedRooms"
import LoadingPage from '@/pages/LoadingPage'

const HomePage = () => {
    const { user } = useAuth();
    const { data: recommendedRooms, isLoading: isRecLoading } = useRecommendedRooms(user?.id, {
        enabled: !!user?.id,
    });
    if (isRecLoading) {
        return <LoadingPage />;
    }

    return (
        <div>
            <HeroSection />
            <MainSection
                recommendedRooms={recommendedRooms}
                isRecLoading={isRecLoading}
            />
        </div>
    )
}

export default HomePage

