import { useQuery } from '@tanstack/react-query';
import { getRecommendedRoom } from '@/services/recommendationService'

const useRecommendedRooms = (userId) => {
    return useQuery({
        queryKey: ['recommendedRooms', userId],
        queryFn: () => getRecommendedRoom(userId),
        enabled: !!userId,
    })
}
export default useRecommendedRooms;