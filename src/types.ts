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
    customMapFormat: boolean;
    formatPreset: string;
    fixedHeight: string;
    // None visible settings
    markers?: Marker[];
    mapZoom: number;
    mapCenter: google.maps.LatLng | google.maps.LatLngLiteral;
};
