import { Route, Stop } from "./types";

export class OtpApi {
    constructor(private baseUri: string) { }

    async getRoutes(): Promise<Route[]> {
        return (await fetch(`${this.baseUri}routes`)).json();
    }

    async getStops(route?: Route | string): Promise<Stop[]> {
        if (typeof route == "undefined") {
            // get every route's stops
            return (await fetch(`${this.baseUri}stops`)).json();
        }

        let stopId: string;
        if (typeof route == "string")
            stopId = route
        else
            stopId = route.id;

        return (await fetch(`${this.baseUri}routes/${stopId}/stops`)).json();
    }
}