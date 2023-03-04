export type Route = {
    id: string;
    shortName: string;
    mode: RouteType;
    agencyName: string;
}

export enum RouteType {
    Bus = "BUS"
}

export type Stop = {
    id: string;
    name: string;
    lat: number;
    long: number;
}