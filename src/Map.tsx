import React, { FC, Fragment, useCallback, useEffect, useState } from 'react';
import { GoogleMap, InfoWindow, Marker, useLoadScript } from '@react-google-maps/api';
import {
    Button,
    ButtonEmphasis,
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
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, MAX_ZOOM } from './config';
import { v4 as uuidv4 } from 'uuid';

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
    const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: apiKey,
        libraries,
    });

    const handleActiveMarker = (markerId: string) => {
        if (markerId === activeMarkerId) {
            return;
        }
        setActiveMarkerId(markerId);
    };

    const onLoad = useCallback((map) => setMap(map), []);
    const onBoundsChanged = useCallback(
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
        [isEditing, map, customMapFormat, formatPreset, fixedHeight, markers]
    );

    const fitBounds = () => {
        if (map && bounds && !bounds.isEmpty()) {
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
        // close open info window
        setActiveMarkerId(null);
    }, [isEditing]);

    if (!isLoaded) {
        return <div>Loading....</div>;
    }

    const bounds = new window.google.maps.LatLngBounds();

    const updateMarker = (marker: MarkerType) => {
        const markerIndex = markers.findIndex((m) => m.id === marker.id);

        if (markerIndex === -1) {
            return;
        }

        const updatedMarkers = [...markers.slice(0, markerIndex), marker, ...markers.slice(markerIndex + 1)];

        setMarkers(updatedMarkers);
    };

    const addNewMarker = () => {
        setMarkers([...markers, { label: '', id: uuidv4() }]);
    };

    const deleteMarker = (marker: MarkerType) => {
        setMarkers(markers.filter((m) => m.id !== marker.id));
    };

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
                    options={{
                        maxZoom: MAX_ZOOM,
                    }}
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
                    {markers &&
                        markers
                            // Do not render markers without location
                            .filter((marker) => marker.location?.lat && marker.location?.lng)
                            .map((marker) => {
                                bounds.extend({
                                    lat: Number(marker.location?.lat),
                                    lng: Number(marker.location?.lng),
                                });
                                return (
                                    <Marker
                                        key={marker.id}
                                        position={{
                                            lat: Number(marker.location?.lat),
                                            lng: Number(marker.location?.lng),
                                        }}
                                        onClick={() => (marker.label ? handleActiveMarker(marker.id) : undefined)}
                                    >
                                        {activeMarkerId === marker.id && marker.label && (
                                            <InfoWindow
                                                options={{ maxWidth: 200 }}
                                                onCloseClick={() => setActiveMarkerId(null)}
                                            >
                                                <div className={style.infoWindow}>{marker.label}</div>
                                            </InfoWindow>
                                        )}
                                    </Marker>
                                );
                            })}
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
                            style={ButtonStyle.Default}
                            emphasis={ButtonEmphasis.Default}
                        >
                            Reset Zoom
                        </Button>
                    </Stack>
                    {markers.map((marker) => {
                        return (
                            <Stack spacing={'s'} padding={'xs'} align={'end'} key={marker.id}>
                                <MarkerInput marker={marker} updateMarker={updateMarker} isLoaded={isLoaded} />
                                <Button
                                    type={ButtonType.Button}
                                    onClick={() => deleteMarker(marker)}
                                    rounding={ButtonRounding.Medium}
                                    icon={<IconTrashBin />}
                                    style={ButtonStyle.Danger}
                                    emphasis={ButtonEmphasis.Strong}
                                />
                            </Stack>
                        );
                    })}
                    <Stack spacing={'s'} padding={'xs'}>
                        <Button
                            type={ButtonType.Button}
                            onClick={addNewMarker}
                            rounding={ButtonRounding.Medium}
                            icon={<IconPlus />}
                            style={ButtonStyle.Default}
                            emphasis={ButtonEmphasis.Default}
                        >
                            Add new location
                        </Button>
                    </Stack>
                </Fragment>
            )}
        </div>
    );
};
