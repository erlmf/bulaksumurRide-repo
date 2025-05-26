const EARTH_RADIUS_KM = 6371;

// Calculate bounding box for coordinates within maxDistance (km)
exports.getBoundingBox = (centerPoint, maxDistanceKm) => {
    const lat = centerPoint.lat;
    const lon = centerPoint.lng;

    // Convert latitude/longitude degrees to radians
    const radLat = (lat * Math.PI) / 180;
    
    // Angular distance in radians on a great circle
    const radDist = maxDistanceKm / EARTH_RADIUS_KM;
    
    const minLat = radLat - radDist;
    const maxLat = radLat + radDist;
    
    // Radius of parallel at given latitude
    const radLatCos = Math.cos(radLat);
    
    let minLon = lon - radDist / radLatCos;
    let maxLon = lon + radDist / radLatCos;

    // Convert back to degrees
    return {
        minLat: (minLat * 180) / Math.PI,
        maxLat: (maxLat * 180) / Math.PI,
        minLon: (minLon * 180) / Math.PI,
        maxLon: (maxLon * 180) / Math.PI
    };
};
