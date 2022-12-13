import defaultMapStyle from './mapStyle';

export const DEFAULT_MAP_CENTER: google.maps.LatLng | google.maps.LatLngLiteral = { lat: 47.376888, lng: 8.541694 };
export const DEFAULT_MAP_ZOOM = 10;
export const MAX_ZOOM = 16;

export const MARKER_WIDTH = 24;
// TODO: Better
export const DEFAULT_MARKER_ICON =
    'https://cdn-assets-eu.frontify.com/s3/frontify-enterprise-files-eu/eyJwYXRoIjoibGlpcFwvZmlsZVwvRTdINUd4azQzQkJKZXVyMVdZc3Muc3ZnIn0:liip:qmnSd5vZ7AFR_fK8UkQJhae6jxYmlwoPQyPd5qwgrtY?width={width}';

export const DEFAULT_MAP_STYLE = defaultMapStyle;
