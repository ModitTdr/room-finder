import { getRoomsByDistance } from '../services/recommendationService.js'

export const getNearbyRooms = async (req, res) => {
    const userId = req.params.id;
    try {
        const rooms = await getRoomsByDistance(userId);
        res.json({ success: true, rooms });
    } catch (error) {
        console.error('Recommendation error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}