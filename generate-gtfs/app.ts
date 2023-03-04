import { OtpApi } from "./lib/otpapi/otpapi";
import { Route, RouteType, Stop } from "./lib/otpapi/types";

const apiBaseUri = "https://otp.algoabus.co.za/otp/routers/default/index/"

// http://dev.opentripplanner.org/apidoc/1.0.0/resources.html

export const lambdaHandler = async (): Promise<any> =>  {
    const api = new OtpApi(apiBaseUri);
    const routes = await api.getRoutes();
    const stops = await api.getStops("1:1");
    let agencyFile = generateAgencyString();
    let calendarFile = generateCalendarString();

    let routesFile = routes.reduce((routesOutSoFar, cur) => routesOutSoFar += "\n" + generateRouteString(cur), generateRouteString());
    let stopsFile = stops.reduce((stopsOutSoFar, cur) => stopsOutSoFar += "\n" + generateStopString(cur), generateStopString());

    let tripsFile = generateTripString(routes);
    return stopsOut;
};

const SERVICE_ID = "1"; // we could look this up but in practice it doesn't matter

// GTFS ref is here: https://gtfs.org/schedule/reference
const generateAgencyString = (): string => {
    return "agency_name,agency_url,agency_timezone\n" + 
           "Algoa Bus Company";
}

const generateStopString = (s?: Stop): string => {
    if (typeof s == "undefined") {
        // Return header line instead of specific stop.
        // If you update this, you also need to update the other return value.
        return "stop_id,stop_name,stop_lat,stop_long"
    }

    return `${s.id},${s.name},${s.lat},${s.long}`;
}

const generateRouteString = (r?: Route): string => {
    if (typeof r == "undefined") {
        // Return header line instead of specific route.
        // If you update this, you also need to update the other return value.
        return "route_id,route_short_name,route_type"
    }

    const route_type_bus = 3;

    if (r.mode != RouteType.Bus) {
        // TODO: fix when Algoa bus gets a thousand times more funding :(
        throw Error(`Type ${r.mode} is not 'bus'.`);
    }

    return `${r.id},${r.shortName},${route_type_bus}`;
}

const generateTripString = (r?: Route): string => {
    if (typeof r == "undefined") {
        // Return header line instead of specific route's trip info.
        // If you update this, you also need to update the other return value.
        return "route_id,service_id,trip_id"
    }

    return `${r.id},${SERVICE_ID},${r.id}` // right now I've set trip id to the same as route ID but this is wrong.
}

const generateCalendarString = (): string => {
    // TODO: I don't know how to get accurate calendar data - what if the service isn't the same every week?
    const startDate = "2023-03-03";
    const endDate = "2023-12-31";
    return "service_id,monday,tuesday,wednesday,thursday,friday,saturday,sunday,start_date,end_date\n" +
           `${SERVICE_ID},1,1,1,1,1,1,1,${startDate},${endDate}`
}