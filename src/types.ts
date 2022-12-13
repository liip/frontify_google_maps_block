export type Location = {
    address: string;
    placeId: string;
    lat: number;
    lng: number;
};

export type Markers = {
    [key: string]: Marker;
};

export type Marker = {
    id: string;
    label: string;
    location?: Location;
};

export type Settings = {
    apiKey: string;
    customMapFormat: boolean;
    formatPreset: string;
    fixedHeight: string;
    // None visible settings
    markers?: Markers;
    mapZoom: number;
    mapCenter: google.maps.LatLngLiteral;
};
