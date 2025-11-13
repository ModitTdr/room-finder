import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (deg) => deg * Math.PI / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function budgetScore(price, minBudget = 0, maxBudget = 1000000) {
  if (price >= minBudget && price <= maxBudget) {
    return 1;
  }
  if (price < minBudget) {
    return Math.max(0, 1 - (minBudget - price) / minBudget);
  }
  const overBudgetRatio = (price - maxBudget) / maxBudget;
  if (overBudgetRatio >= 0.5) return 0;
  return 1 - (overBudgetRatio * 2);
}

function weightScore(rooms, userdata) {
  const maxDistance = Math.max(...rooms.map(r => r.distance))
  const weightedRooms = rooms.map(room => {
    const distanceScore = maxDistance ? 1 - room.distance / maxDistance : 1;


    const budgetScoreValue = budgetScore(room.price, userdata.minBudget ?? 0, userdata.maxBudget ?? 1000000);

    const preferredAmenities = userdata.amenityPreferences || [];
    const matchingAmenitiesCount = room.amenities.filter(a => preferredAmenities.includes(a)).length;
    const amenityScore = preferredAmenities.length > 0
      ? matchingAmenitiesCount / preferredAmenities.length
      : 1;

    const finalScore = distanceScore * 0.4 + budgetScoreValue * 0.35 + amenityScore * 0.25;
    return { ...room, finalScore };
  })
  return weightedRooms.sort((a, b) => b.finalScore - a.finalScore);
}

export const getRoomsByDistance = async (userId) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: {
      latitude: true,
      longitude: true,
      minBudget: true,
      maxBudget: true,
      amenityPreferences: true,
    }
  });
  if (!profile || profile.latitude == null || profile.longitude == null) {
    throw new Error("User profile or preferences not found");
  }

  const rooms = await prisma.room.findMany({
    where: {
      available: true,
    }
  });

  //returns room data along with distance
  const roomWithDistance = rooms
    .map(room => {
      const distance = haversine(profile.latitude, profile.longitude, room.latitude, room.longitude)
      return { ...room, distance }
    })
  //sort k number of room by distance
  const k = 6;
  const closestTopRooms = roomWithDistance
    .sort((a, b) => a.distance - b.distance)
    .slice(0, k)

  return weightScore(closestTopRooms, profile);
}
