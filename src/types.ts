export type Marker = {
    label: string;
    lat: string;
    lng: string;
};

export type Settings = {
    apiKey: string;
    markers?: Marker[];
};
