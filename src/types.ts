export type Location = {
    address: string;
    placeId: string;
    lat: number;
    lng: number;
};

export type Marker = {
    label: string;
    location?: Location;
};

export type Settings = {
    apiKey: string;
    markers?: Marker[];
    showLabels: boolean;
    customMapFormat: boolean;
    formatPreset: string;
    fixedHeight: string;
};
