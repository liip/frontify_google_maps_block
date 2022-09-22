import React, { FC, Fragment, useState } from 'react';
import {
    FormControl,
    FormControlDirection,
    FormControlStyle,
    TextInput,
    TextInputType,
    debounce,
} from '@frontify/fondue';
import { Marker } from './types';

type Props = {
    marker: Marker;
    index: number;
    setMarker: (marker: Marker, index: number) => void;
};

export const MarkerInput: FC<Props> = ({ marker, index, setMarker }) => {
    const latId = `marker-lat-${index}`;
    const lngId = `marker-lng-${index}`;
    const [markerLat, setMarkerLat] = useState<string>(marker.lat);
    const [markerLng, setMarkerLng] = useState<string>(marker.lng);

    const debouncedSetMarker = React.useMemo(
        () =>
            debounce((marker: Marker, index: number) => {
                setMarker(marker, index);
            }, 200),
        [setMarker]
    );

    return (
        <Fragment key={index}>
            <FormControl
                clickable
                direction={FormControlDirection.Vertical}
                label={{
                    children: 'Latitude',
                    htmlFor: latId,
                    required: true,
                }}
                style={FormControlStyle.Primary}
            >
                <TextInput
                    id={latId}
                    value={markerLat}
                    type={TextInputType.Text}
                    required={true}
                    onChange={(newLat) => {
                        setMarkerLat(newLat);
                        debouncedSetMarker({ ...marker, lat: newLat }, index);
                    }}
                />
            </FormControl>
            <FormControl
                clickable
                direction={FormControlDirection.Vertical}
                extra=""
                label={{
                    children: 'Longitude',
                    htmlFor: lngId,
                    required: true,
                }}
                style={FormControlStyle.Primary}
            >
                <TextInput
                    id={lngId}
                    value={markerLng}
                    type={TextInputType.Text}
                    required={true}
                    onChange={(newLng) => {
                        setMarkerLng(newLng);
                        debouncedSetMarker({ ...marker, lng: newLng }, index);
                    }}
                />
            </FormControl>
        </Fragment>
    );
};
