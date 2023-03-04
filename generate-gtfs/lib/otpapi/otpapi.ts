import { PatternShort, Route, RouteShort, StopShort, Trip, TripShort, TripTime } from "./types";

// http://dev.opentripplanner.org/apidoc/2.2.0/resources.html

export class OtpApi {
    constructor(private baseUri: string) { }

    async getRoutes(): Promise<RouteShort[]> {
        return await (await fetch(`${this.baseUri}routes`)).json();
    }

    async getRoute(routeId: string): Promise<Route> {
        return await (await fetch(`${this.baseUri}routes/${routeId}`)).json();
    }

    async getPatterns(routeId: string): Promise<PatternShort[]> {
        return await (await fetch(`${this.baseUri}routes/${routeId}/patterns`)).json();
    }

    async getTripsForPattern(patternId: string): Promise<TripShort[]> {
        return await (await fetch(`${this.baseUri}patterns/${patternId}`)).json();
    }

    async getTrip(tripId: string): Promise<Trip> {
        return await (await fetch(`${this.baseUri}trips/${tripId}`)).json();
    }

    async getTripStops(tripId: string): Promise<StopShort[]> {
        return await (await fetch(`${this.baseUri}trips/${tripId}/stops`)).json();
    }

    async getTripStopTimes(tripId: string): Promise<TripTime[]> {
        return await (await fetch(`${this.baseUri}trips/${tripId}/stoptimes`)).json();
    }
}