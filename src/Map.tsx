import React, { FC } from 'react';
import style from './style.module.css';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { Marker as MarkerType } from './types';
import { MarkerInput } from './MarkerInput';
import { Button, ButtonRounding, ButtonStyle, ButtonType, IconPlus, IconTrashBin, Stack } from '@frontify/fondue';

type Props = {
    apiKey: string;
    markers?: MarkerType[];
    setMarkers: (markers: MarkerType[]) => void;
};

type LibraryConfig = ('places' | 'drawing' | 'geometry' | 'localContext' | 'visualization')[];

const libraries: LibraryConfig = ['places'];

export const Map: FC<Props> = ({ apiKey, markers = [], setMarkers }) => {
    const initialMapCenter = { lat: 47.394144, lng: 0.68484 };

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: apiKey,
        libraries,
    });

    if (!isLoaded) {
        return <div>Loading....</div>;
    }

    const setMarker = (marker: MarkerType, index: number) => {
        const newMarkers = [...markers];
        newMarkers[index] = marker;
        setMarkers(newMarkers);
    };

    const deleteMarker = (marker: MarkerType, index: number) => {
        setMarkers(markers.filter((marker) => marker !== markers[index]));
    };

    return (
        <div>
            <GoogleMap zoom={10} center={initialMapCenter} mapContainerClassName={style.containerMap}>
                {markers.map((marker, index) => {
                    return (
                        <Marker
                            key={index}
                            position={{ lat: Number(marker.location.lat), lng: Number(marker.location.lng) }}
                        />
                    );
                })}
            </GoogleMap>
            {markers.map((marker, index) => {
                return (
                    <Stack spacing={'s'} padding={'xs'} align={'end'} key={marker.location.address}>
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
                    onClick={() => setMarker({ location: { address: '', lat: 0, lng: 0 }, label: '' }, markers?.length)}
                    rounding={ButtonRounding.Medium}
                    icon={<IconPlus />}
                    style={ButtonStyle.Secondary}
                >
                    Add new Location Marker
                </Button>
            </Stack>
        </div>
    );
};
