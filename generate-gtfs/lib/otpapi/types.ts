export type RouteShort = {
    id: string;
    shortName: string;
    mode: RouteType;
    agencyName: string;
}

export type Route = {
    id: string;
    agency: Agency;
    shortName: string;
    type: number;
    bikesAllowed: boolean;
}

// This is kind of a weird concept but a "route" is actually many routes with the same number but different stops, each of these are called patterns
export type PatternShort = {
    id: string;
    desc: string;
    routeId: string;
}

export type PatternDetail = PatternShort & {
    stops: StopShort[];
    trips: TripShort[];
}


export type Agency = {
    id: string;
    name: string;
    url: string;
    timezone: string;
    lang: string;
    phone: string;
}

export enum RouteType {
    Bus = "BUS"
}

// a trip is one instance of a pattern (ie., one physical bus)
export type TripShort = {
    id: string;
    serviceId: string;
    shapeId: string; //not sure what this is, but think it's the geometry of the route
}

export type Trip = TripShort & {
    routeId: string;
    tripShortName: string;
    wheelchairAccessible: boolean;
    bikesAllowed: boolean;
}

export type StopShort = {
    id: string;
    name: string;
    lat: number;
    long: number;
}

export type TripTime = {
    stopId: string;
    stopIndex: number; // how many stop the bus made before this one
    stopCount: number; // how many stops there are
    scheduledArrival: number; // seconds since midnight
    scheduledDeparture: number;
    realtimeArrival: number;
    realtimeDeparture: number;
    arrivalDelay: number;
    departureDelay: number;
    timepoint: number; // are the times exact (as opposed to guesses)
    realtime: boolean; // not sure what this means
    isCancelledStop: boolean;
    realtimeState: string; // http://dev.opentripplanner.org/apidoc/2.2.0/json_ApiRealTimeState.html
    serviceDay: number; // A service day is a time period used to indicate route scheduling
    // Pickup/dropoff type: Indicates pickup method. Valid options are:
    //  0 or empty - Regularly scheduled pickup.
    //  1 - No pickup available.
    //  2 - Must phone agency to arrange pickup.
    //  3 - Must coordinate with driver to arrange pickup.
    pickupType: number;
    dropoffType: number;
}