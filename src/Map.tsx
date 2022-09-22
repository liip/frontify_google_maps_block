import React, { FC } from 'react';
import style from './style.module.css';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { Marker as MarkerType } from './types';
import { MarkerInput } from './MarkerInput';

type Props = {
    apiKey: string;
    markers?: MarkerType[];
    setMarkers: (markers: MarkerType[]) => void;
};

export const Map: FC<Props> = ({ apiKey, markers = [], setMarkers }) => {
    const initialMapCenter = { lat: 47.394144, lng: 0.68484 };

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: apiKey,
    });

    if (!isLoaded) {
        return <div>Loading....</div>;
    }

    const setMarker = (marker: MarkerType, index: number) => {
        const newMarkers = [...markers];
        newMarkers[index] = marker;
        setMarkers(newMarkers);
    };

    return (
        <div>
            <GoogleMap zoom={10} center={initialMapCenter} mapContainerClassName={style.containerMap}>
                {markers.map((marker, index) => {
                    return <Marker key={index} position={{ lat: Number(marker.lat), lng: Number(marker.lng) }} />;
                })}
            </GoogleMap>
            {markers.map((marker, index) => {
                return <MarkerInput key={index} marker={marker} index={index} setMarker={setMarker} />;
            })}
        </div>
    );
};