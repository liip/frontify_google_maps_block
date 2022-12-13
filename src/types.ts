export type Location = {
    address: string;
    placeId: string;
    lat: number;
    lng: number;
};

export type Marker = {
    id: string;
    label: string;
    location?: Location;
};

export type Settings = {
    apiKey: string;
    allowMapControls: boolean;
    markerIcon: string;
    markerIconEnabled: boolean;
    mapStyle: string;
    mapStyleEnabled: boolean;
    customMapFormat: boolean;
    formatPreset: string;
    fixedHeight: string;
    // None visible settings
    markers?: Marker[];
    mapZoom: number;
    mapCenter: google.maps.LatLng | google.maps.LatLngLiteral;
};
