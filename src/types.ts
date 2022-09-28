export type Location = {
    address: string;
    lat?: number;
    lng?: number;
};

export type Marker = {
    label: string;
    location: Location;
};

export type Settings = {
    apiKey: string;
    markers?: Marker[];
    showLabels: boolean;
};
