function calculateDistance(coord1, coord2) {
  // Validate inputs
  if (!coord1 || !coord2 || typeof coord1.lat !== 'number' || typeof coord1.lng !== 'number' || 
      typeof coord2.lat !== 'number' || typeof coord2.lng !== 'number') {
    return 0; // Return 0 for invalid coordinates
  }

  const R = 6371; // Earth's radius in kilometers
  const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
  const dLon = (coord2.lng - coord1.lng) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(coord1.lat * Math.PI / 180) *
    Math.cos(coord2.lat * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
}

module.exports = calculateDistance;
