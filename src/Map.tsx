import React, { FC, Fragment, useCallback, useEffect, useState } from 'react';
import { GoogleMap, InfoWindow, Marker, useLoadScript } from '@react-google-maps/api';
import {
    Button,
    ButtonRounding,
    ButtonStyle,
    ButtonType,
    IconFocalPoint,
    IconPlus,
    IconTrashBin,
    Stack,
    debounce,
} from '@frontify/fondue';
import style from './style.module.css';
import { MarkerInput } from './MarkerInput';
import { Marker as MarkerType, Settings } from './types';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from './config';

type Props = {
    setMarkers: (markers: MarkerType[]) => void;
    setMapState: (zoom: number, center: google.maps.LatLng | google.maps.LatLngLiteral) => void;
    isEditing: boolean;
    settings: Settings;
};

type MapType = google.maps.Map;

type LibraryConfig = ('places' | 'drawing' | 'geometry' | 'localContext' | 'visualization')[];

const libraries: LibraryConfig = ['places'];

const mapClassNames: Record<string, Record<string, string>> = {
    '16to9': {
        inner: style.mapContainerInner16to9,
        outer: style.mapContainerOuter16to9,
    },
    '4to3': {
        inner: style.mapContainerInner4to3,
        outer: style.mapContainerOuter4to3,
    },
    '1to1': {
        inner: style.mapContainerInner1to1,
        outer: style.mapContainerOuter1to1,
    },
};

export const Map: FC<Props> = ({ setMarkers, setMapState, isEditing, settings }) => {
    const { markers = [], apiKey, customMapFormat, formatPreset, fixedHeight, mapZoom, mapCenter } = settings;
    const [map, setMap] = useState<MapType>();

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: apiKey,
        libraries,
    });

    const onLoad = useCallback((map) => setMap(map), []);
    const onBoundsChanged = React.useMemo(
        () =>
            debounce(() => {
                if (isEditing && map) {
                    const center = map.getCenter();
                    const lat = center?.lat();
                    const lng = center?.lng();
                    if (lat && lng) {
                        setMapState(map.getZoom() || DEFAULT_MAP_ZOOM, { lat, lng });
                    }
                }
            }, 500),
        [isEditing, customMapFormat, formatPreset, fixedHeight, markers]
    );

    const fitBounds = () => {
        if (map && bounds) {
            map.fitBounds(bounds);
        }
    };

    useEffect(() => {
        fitBounds();
    }, [markers]);

    useEffect(() => {
        if (isEditing && map) {
            // Reset map bounds when switching to edit mode
            map.setZoom(mapZoom || DEFAULT_MAP_ZOOM);
            map.setCenter(mapCenter || DEFAULT_MAP_CENTER);
        }
    }, [isEditing]);

    if (!isLoaded) {
        return <div>Loading....</div>;
    }

    const bounds = new window.google.maps.LatLngBounds();

    const setMarker = (marker: MarkerType, index: number) => {
        const newMarkers = [...markers];
        newMarkers[index] = marker;
        setMarkers(newMarkers);
    };

    const deleteMarker = (marker: MarkerType, index: number) => {
        setMarkers(markers.filter((marker) => marker !== markers[index]));
    };

    const getMarkerKey = (marker: MarkerType, index: number) => `${marker.location?.placeId || 'newPlace'}-${index}`;

    return (
        <div>
            <div
                className={
                    !customMapFormat
                        ? [style.mapContainerOuter, mapClassNames[formatPreset].outer].join(' ')
                        : undefined
                }
                style={customMapFormat ? { height: fixedHeight ? parseInt(fixedHeight) : 500 } : undefined}
            >
                <GoogleMap
                    zoom={mapZoom || DEFAULT_MAP_ZOOM}
                    center={mapCenter || DEFAULT_MAP_CENTER}
                    mapContainerClassName={
                        !customMapFormat
                            ? [style.mapContainerInner, mapClassNames[formatPreset].inner].join(' ')
                            : style.mapContainerCustom
                    }
                    onLoad={onLoad}
                    onZoomChanged={isEditing ? onBoundsChanged : undefined}
                    onCenterChanged={isEditing ? onBoundsChanged : undefined}
                >
                    {markers
                        ? markers
                              // Do not render markers without location
                              .filter((marker) => marker.location?.lat && marker.location?.lng)
                              .map((marker, index) => {
                                  bounds.extend({
                                      lat: Number(marker.location?.lat),
                                      lng: Number(marker.location?.lng),
                                  });
                                  return (
                                      <Marker
                                          key={getMarkerKey(marker, index)}
                                          position={{
                                              lat: Number(marker.location?.lat),
                                              lng: Number(marker.location?.lng),
                                          }}
                                      >
                                          {/*{marker.label && (*/}
                                          {/*    <InfoWindow options={{ maxWidth: 200 }}>*/}
                                          {/*        <div className={style.infoWindow}>*/}
                                          {/*            <h1>{marker.label}</h1>*/}
                                          {/*        </div>*/}
                                          {/*    </InfoWindow>*/}
                                          {/*)}*/}
                                      </Marker>
                                  );
                              })
                        : ''}
                </GoogleMap>
            </div>
            {isEditing && (
                <Fragment>
                    <Stack spacing={'s'} padding={'xs'}>
                        <Button
                            type={ButtonType.Button}
                            onClick={fitBounds}
                            rounding={ButtonRounding.Medium}
                            icon={<IconFocalPoint />}
                            style={ButtonStyle.Secondary}
                        >
                            Reset Zoom
                        </Button>
                    </Stack>
                    {markers.map((marker, index) => {
                        return (
                            <Stack spacing={'s'} padding={'xs'} align={'end'} key={getMarkerKey(marker, index)}>
                                <MarkerInput marker={marker} index={index} setMarker={setMarker} isLoaded={isLoaded} />
                                <Button
                                    type={ButtonType.Button}
                                    onClick={() => deleteMarker(marker, index)}
                                    rounding={ButtonRounding.Medium}
                                    icon={<IconTrashBin />}
                                    style={ButtonStyle.Secondary}
                                />
                            </Stack>
                        );
                    })}
                    <Stack spacing={'s'} padding={'xs'}>
                        <Button
                            type={ButtonType.Button}
                            onClick={() => setMarker({ label: '' }, markers?.length)}
                            rounding={ButtonRounding.Medium}
                            icon={<IconPlus />}
                            style={ButtonStyle.Secondary}
                        >
                            Add new location
                        </Button>
                    </Stack>
                </Fragment>
            )}
        </div>
    );
};
