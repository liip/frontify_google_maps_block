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
import isEqual from 'lodash-es/isEqual';

import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, MAX_ZOOM } from './config';
import { MarkerInput } from './MarkerInput';
import { Marker as MarkerType, Markers, Settings } from './types';

import style from './style.module.css';

type Props = {
    isEditing: boolean;
    settings: Settings;
    setSettings: (newSettings: Partial<Settings>) => Promise<void>;
    setIsReadyForPrint: (isReady: boolean) => void;
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
    return str ? str.replaceAll(/(\r\n|\n\r|\r|\n)/g, '<br />') : str;
};

export const Map: FC<Props> = ({ isEditing, settings, setSettings, setIsReadyForPrint }) => {
    const { apiKey, customMapFormat, formatPreset, fixedHeight } = settings;
    const [map, setMap] = useState<MapType | undefined>();
    const [state, setState] = useState<{
        markers: Markers;
        mapZoom: number;
        mapCenter: google.maps.LatLngLiteral;
    }>({
        markers: settings.markers || {},
        mapZoom: settings.mapZoom || DEFAULT_MAP_ZOOM,
        mapCenter: settings.mapCenter || DEFAULT_MAP_CENTER,
    });
    const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);

    useEffect(() => {
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

    const onLoad = useCallback(
        (map) => {
            setMap(map);
            setIsReadyForPrint(true);
        },
        [setIsReadyForPrint]
    );

    const fitBounds = (markers: Markers) => {
        if (map) {
            const bounds = new window.google.maps.LatLngBounds();
            for (const markerId in markers) {
                if (markers[markerId].location?.lat && markers[markerId].location?.lng) {
                    bounds.extend({
                        lat: Number(markers[markerId].location?.lat),
                        lng: Number(markers[markerId].location?.lng),
                    });
                }
            }
            if (!bounds.isEmpty()) {
                map.fitBounds(bounds);
            }
        }
    };

    const resetZoom = () => {
        if (map) {
            map.setZoom(state.mapZoom);
            map.setCenter(state.mapCenter);
        }
    };

    useEffect(() => {
        if (isEditing && map) {
            resetZoom();
        }
        if (!isEditing && map) {
            // Save map state when edit mode is left
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
    }, [isEditing]);

    if (!isLoaded) {
        return <div>Loading....</div>;
    }

    const updateMarker = (marker: MarkerType) => {
        const newState = {
            ...state,
            markers: {
                ...state.markers,
                [marker.id]: marker,
            },
        };

        // Only run fitBounds when location has changed
        if (!isEqual(state.markers[marker.id]?.location, marker.location)) {
            fitBounds(newState.markers);
        }

        setState(newState);
    };

    const addNewMarker = () => {
        const newMarkerId = uuidv4();
        setState({
            ...state,
            markers: {
                ...state.markers,
                [newMarkerId]: { id: newMarkerId, label: '' },
            },
        });
    };

    const deleteMarker = (markerId: string) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [markerId]: deletedMarker, ...markersWithoutDeletedMarker } = state.markers;
        fitBounds(markersWithoutDeletedMarker);
        setState({ ...state, markers: markersWithoutDeletedMarker });
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
                        Object.keys(state.markers)
                            // Do not render markers without location
                            .filter(
                                (markerId) =>
                                    state.markers[markerId].location?.lat && state.markers[markerId].location?.lng
                            )
                            .map((markerId) => (
                                <Marker
                                    key={markerId}
                                    position={{
                                        lat: Number(state.markers[markerId].location?.lat),
                                        lng: Number(state.markers[markerId].location?.lng),
                                    }}
                                    onClick={() =>
                                        state.markers[markerId].label ? handleActiveMarker(markerId) : undefined
                                    }
                                >
                                    {activeMarkerId === state.markers[markerId].id && state.markers[markerId].label && (
                                        <InfoWindow
                                            options={{ maxWidth: 200 }}
                                            onCloseClick={() => setActiveMarkerId(null)}
                                        >
                                            <div
                                                className={style.infoWindow}
                                                dangerouslySetInnerHTML={{
                                                    __html: nl2br(state.markers[markerId].label),
                                                }}
                                            />
                                        </InfoWindow>
                                    )}
                                </Marker>
                            ))}
                </GoogleMap>
            </div>
            {isEditing ? (
                <Fragment>
                    <Stack spacing={'s'} padding={'xs'} align={'center'}>
                        <div className={'tw-flex-shrink-0'}>
                            <Button
                                type={ButtonType.Button}
                                onClick={() => fitBounds(state.markers)}
                                rounding={ButtonRounding.Medium}
                                icon={<IconFocalPoint />}
                                style={ButtonStyle.Default}
                                emphasis={ButtonEmphasis.Default}
                            >
                                Fit Zoom to Markers
                            </Button>
                        </div>
                        <Text as="p" size="small">
                            The current map position and zoom level are persisted as soon as you switch back to the view
                            mode.
                        </Text>
                    </Stack>
                    {Object.keys(state.markers).map((markerId) => (
                        <Stack spacing={'s'} padding={'xs'} align={'start'} key={state.markers[markerId].id}>
                            <MarkerInput
                                marker={state.markers[markerId]}
                                updateMarker={updateMarker}
                                isLoaded={isLoaded}
                            />
                            <div className="tw-pt-6">
                                <Button
                                    type={ButtonType.Button}
                                    onClick={() => deleteMarker(markerId)}
                                    rounding={ButtonRounding.Medium}
                                    icon={<IconTrashBin />}
                                    style={ButtonStyle.Danger}
                                    emphasis={ButtonEmphasis.Strong}
                                />
                            </div>
                        </Stack>
                    ))}
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
            ) : (
                <Stack spacing={'s'} padding={'xs'} align={'center'}>
                    <Button
                        type={ButtonType.Button}
                        onClick={() => resetZoom()}
                        rounding={ButtonRounding.Medium}
                        icon={<IconFocalPoint />}
                        style={ButtonStyle.Default}
                        emphasis={ButtonEmphasis.Default}
                    >
                        Reset Zoom
                    </Button>
                </Stack>
            )}
        </div>
    );
};
