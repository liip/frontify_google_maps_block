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
    Text,
} from '@frontify/fondue';
import { GoogleMap, InfoWindow, Marker, useLoadScript } from '@react-google-maps/api';
import React, { FC, Fragment, useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, MAX_ZOOM } from './config';
import { MarkerInput } from './MarkerInput';
import style from './style.module.css';
import { Marker as MarkerType, Settings } from './types';

type Props = {
    isEditing: boolean;
    settings: Settings;
    setSettings: (newSettings: Partial<Settings>) => Promise<void>;
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

const nl2br = (str: string) => {
    return str ? str.replace(/(\r\n|\n\r|\r|\n)/g, '<br />') : str;
};

export const Map: FC<Props> = ({ isEditing, settings, setSettings }) => {
    const { apiKey, customMapFormat, formatPreset, fixedHeight } = settings;
    const [map, setMap] = useState<MapType | undefined>();
    const [state, setState] = useState<{
        markers: MarkerType[];
        mapZoom: number;
        mapCenter: google.maps.LatLngLiteral;
    }>({
        markers: settings.markers || [],
        mapZoom: settings.mapZoom || DEFAULT_MAP_ZOOM,
        mapCenter: settings.mapCenter || DEFAULT_MAP_CENTER,
    });
    const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);

    useEffect(() => {
        console.log(state);
        setSettings && setSettings(state);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

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

    const fitBounds = () => {
        if (map && bounds && !bounds.isEmpty()) {
            map.fitBounds(bounds);
        }
    };

    useEffect(() => {
        if (isEditing && map) {
            map.setZoom(state.mapZoom);
            map.setCenter(state.mapCenter);
        }
        if (!isEditing && map) {
            setState({
                ...state,
                mapZoom: map.getZoom() || DEFAULT_MAP_ZOOM,
                mapCenter: {
                    lat: map.getCenter()?.lat() || DEFAULT_MAP_CENTER.lat,
                    lng: map.getCenter()?.lng() || DEFAULT_MAP_CENTER.lng,
                },
            });
        }
        // close open info window
        setActiveMarkerId(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditing, map]);

    if (!isLoaded) {
        return <div>Loading....</div>;
    }

    const bounds = new window.google.maps.LatLngBounds();

    const updateMarker = (marker: MarkerType) => {
        const markerIndex = state.markers.findIndex((m) => m.id === marker.id);

        if (markerIndex === -1) {
            return;
        }

        const updatedMarkers = [
            ...state.markers.slice(0, markerIndex),
            marker,
            ...state.markers.slice(markerIndex + 1),
        ];

        // Run fitbounds only when it is NOT the label that has changed
        if (state.markers[markerIndex].label === marker.label) {
            fitBounds();
        }

        setState({ ...state, markers: updatedMarkers });
    };

    const addNewMarker = () => {
        setState({ ...state, markers: [...state.markers, { label: '', id: uuidv4() }] });
        fitBounds();
    };

    const deleteMarker = (marker: MarkerType) => {
        setState({ ...state, markers: state.markers.filter((m) => m.id !== marker.id) });
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
                    zoom={state.mapZoom || DEFAULT_MAP_ZOOM}
                    options={{
                        maxZoom: MAX_ZOOM,
                    }}
                    center={state.mapCenter || DEFAULT_MAP_CENTER}
                    mapContainerClassName={
                        !customMapFormat
                            ? [style.mapContainerInner, mapClassNames[formatPreset].inner].join(' ')
                            : style.mapContainerCustom
                    }
                    onLoad={onLoad}
                >
                    {state.markers &&
                        state.markers
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
                                                <div
                                                    className={style.infoWindow}
                                                    dangerouslySetInnerHTML={{ __html: nl2br(marker.label) }}
                                                />
                                            </InfoWindow>
                                        )}
                                    </Marker>
                                );
                            })}
                </GoogleMap>
            </div>
            {isEditing && (
                <Fragment>
                    <Stack spacing={'s'} padding={'xs'} align={'center'}>
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
                        <Text as="p" size="small">
                            The current map position and zoom level are persisted and used to initialize the map in the
                            view mode.
                        </Text>
                    </Stack>
                    {state.markers.map((marker) => {
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
