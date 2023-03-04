import JSZip from "jszip";
import { OtpApi } from "./lib/otpapi/otpapi";
import { Route, RouteShort, RouteType, StopShort } from "./lib/otpapi/types";
import * as fs from 'fs';

const apiBaseUri = "https://otp.algoabus.co.za/otp/routers/default/index/"

export const lambdaHandler = async (): Promise<any> =>  {
    const api = new OtpApi(apiBaseUri);
    const routes = await api.getRoutes();
    let agencyFile = generateAgencyString();
    let calendarFile = generateCalendarString();
    let routesFile = [undefined, ...routes].map(r => generateRouteString(r)).join("\n");

    
    const zip = new JSZip();
    zip.file("agency.txt", agencyFile);
    zip.file("calendar.txt", calendarFile);
    zip.file("routes.txt", routesFile);
    const zipFile = await zip.generateAsync({type: "nodebuffer"});
    const outFile = fs.createWriteStream("/tmp/gtfs.zip");
    outFile.write(zipFile);
    outFile.close()
    console.log(routes.length)
    console.log(routesFile.replace("\n", " "))
    // GTFS ref is here: https://gtfs.org/schedule/reference
};

const generateAgencyString = (): string => {
    // TODO: we should get this from the API directly.
    return "agency_name,agency_url,agency_timezone\n" + 
    "Algoa Bus Company";
}

const generateStopString = (s?: StopShort): string => {
    if (typeof s == "undefined") {
        // Return header line instead of specific stop.
        // If you update this, you also need to update the other return value.
        return "stop_id,stop_name,stop_lat,stop_long"
    }
    
    return `${s.id},${s.name},${s.lat},${s.long}`;
}

const generateRouteString = (r?: RouteShort): string => {
    if (typeof r == "undefined") {
        // Return header line instead of specific route.
        // If you update this, you also need to update the other return value.
        return "route_id,route_short_name,route_type"
    }
    
    const route_type_bus = 3;
    
    if (r.mode != RouteType.Bus) {
            throw Error(`Type ${r.mode} must be 'bus'.`);
        }
        
    return `${r.id},${r.shortName},${route_type_bus}`;
}

const EVERY_DAY_SERVICE_ID = "1"; // we could look this up but in practice it doesn't matter

const generateCalendarString = (): string => {
    // TODO: The API definitely has the concept of service (basically it's when trips are running, on a calendar), 
    // but I can't find any way to figure out what the service details are.
    const startDate = "2023-03-03";
    const endDate = "2023-12-31";
    return "service_id,monday,tuesday,wednesday,thursday,friday,saturday,sunday,start_date,end_date\n" +
    `${EVERY_DAY_SERVICE_ID},1,1,1,1,1,1,1,${startDate},${endDate}`
}