import * as Location from "expo-location";

const GOOGLE_MAPS_API_KEY = "asc";

//pass data from here to liveData
let speedLimit = 0;

export const checkPermission = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status === 'granted') {
        return true;
    } else {
        return false;
    }
};

export const getLocation = async () => {
    const perms = await checkPermission();
    if (!perms) {
        noPermHandler();
        return;
    }
    try {
        const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High
        });
        console.log(`Location obtained: ${location.coords.latitude}, ${location.coords.longitude}`);
        getSpeedLimit(location.coords);
    } catch (error) {
        console.error("Error getting location:", error);
        return speedLimit = 120;
    }
};

export const getSpeedLimit = async (coords) => {
    if (!coords) return speedLimit = 120;

    const { latitude, longitude } = coords;

    //query to get all nearby roads that have a highway tag
    //then check if maxspeed is defined, or just assume the speedlimit based on roadtypes
    const overpassQuery = `
        [out:json];
        way(around:50,${latitude},${longitude})["highway"];
        out tags;
    `;

    try {
        const response = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `data=${encodeURIComponent(overpassQuery)}`
        });

        const data = await response.json();

        if (data.elements && data.elements.length > 0) {
            const road = data.elements[0].tags;

            if (road.maxspeed) {
                console.log(`Speed limit from OSM: ${road.maxspeed}`);
                return speedLimit = parseInt(road.maxspeed);
            } else if (road.highway) {
                const inferredSpeed = speedFromRoadType(road.highway);
                console.log(`Inferred speed limit for ${road.highway}: ${inferredSpeed}`);
                return speedLimit = inferredSpeed;
            }
        }

        console.log('No road found near location.');
        return speedLimit = 120;

    } catch (error) {
        console.error('Error fetching OSM speed limit:', error);
        return speedLimit = 120;
    }
};

const speedFromRoadType = (roadType) => {
    switch (roadType) {
        case 'motorway': return 120;
        case 'trunk':
        case 'primary':
        case 'secondary': return 100;
        case 'tertiary':
        case 'unclassified':
        case 'residential': return 50;
        case 'service': return 30;
        default: return 80; // fallback
    }
};

export const noPermHandler = async () => {
    speedLimit = 120;
    return speedLimit; 
};