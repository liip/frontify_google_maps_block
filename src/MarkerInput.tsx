import React, { FC, useState } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import {
    FormControl,
    FormControlDirection,
    FormControlStyle,
    Stack,
    TextInput,
    TextInputType,
    debounce,
} from '@frontify/fondue';
import { Marker } from './types';

type Props = {
    isLoaded: boolean;
    marker: Marker;
    index: number;
    setMarker: (marker: Marker, index: number) => void;
};

type AutocompleteInstance = google.maps.places.Autocomplete;

export const MarkerInput: FC<Props> = ({ marker, index, setMarker, isLoaded }) => {
    const locationId = `location-${index}`;
    const labelId = `label-${index}`;
    const [address, setAddress] = useState<string>(marker.location?.address || '');
    const [label, setLabel] = useState<string>(marker.label);

    const debouncedSetMarker = React.useMemo(
        () =>
            debounce((marker: Marker, index: number) => {
                setMarker(marker, index);
            }, 200),
        [setMarker]
    );

    const [autocomplete, setAutocomplete] = useState<AutocompleteInstance>();

    function onLoad(autocomplete: AutocompleteInstance) {
        if (autocomplete) {
            setAutocomplete(autocomplete);
        }
    }

    function onPlaceChanged() {
        const place = autocomplete?.getPlace();
        if (place?.name) {
            setAddress(place.name);
            debouncedSetMarker(
                {
                    ...marker,
                    location: {
                        address: place.name || '',
                        placeId: place.place_id,
                        lat: place.geometry?.location?.lat(),
                        lng: place.geometry?.location?.lng(),
                    },
                },
                index
            );
        } else {
            console.log('Autocomplete is not loaded yet!');
        }
    }

    if (!isLoaded) {
        return <div>Loading....</div>;
    }

    return (
        <div className={'tw-w-full'}>
            <Stack padding={'none'} spacing={'s'}>
                <FormControl
                    clickable
                    direction={FormControlDirection.Vertical}
                    label={{
                        children: 'Label',
                        htmlFor: labelId,
                    }}
                    style={FormControlStyle.Primary}
                >
                    <TextInput
                        id={labelId}
                        value={label}
                        type={TextInputType.Text}
                        onChange={(newLabel) => {
                            setLabel(newLabel);
                            debouncedSetMarker({ ...marker, label: newLabel }, index);
                        }}
                    />
                </FormControl>
                <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged} className={'tw-w-full'}>
                    <FormControl
                        clickable
                        direction={FormControlDirection.Vertical}
                        label={{
                            children: 'Location',
                            htmlFor: locationId,
                            required: true,
                        }}
                        style={FormControlStyle.Primary}
                    >
                        <TextInput
                            id={locationId}
                            value={address || ''}
                            type={TextInputType.Text}
                            required={true}
                            onChange={(newAddress) => {
                                setAddress(newAddress);
                            }}
                        />
                    </FormControl>
                </Autocomplete>
            </Stack>
        </div>
    );
};
