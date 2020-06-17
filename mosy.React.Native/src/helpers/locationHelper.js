

const formatDistanceToVenue = (distanceMeters) => {
    let result = distanceMeters;
    if (0 < distanceMeters && distanceMeters <= 1000)
        result = `${distanceMeters.toFixed(0)}m`;
    else if (1000 < distanceMeters && distanceMeters <= 99000)
        result = `${(distanceMeters / 1000).toFixed(1)}km`;
    else if (99000 < distanceMeters)
        result = `${(distanceMeters / 1000).toFixed(0)}km`;
    return result;
}

const formatWalkingTimeToVenue = (distanceMeters) => {
    const WALKING_SPEED_KMH = 5;
    const distanceKm = distanceMeters / 1000;
    let result = distanceKm / WALKING_SPEED_KMH;
    if (result < 1)
        result = `${parseInt(result * 60)}min`;
    else if (result > 24)
        result = `${parseInt(result / 24)}d`;
    else
        result = `${result.toFixed(1)}h`;
    return result;
}


export const locationHelper = {
    formatDistanceToVenue,
    formatWalkingTimeToVenue,
};