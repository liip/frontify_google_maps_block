import React, { FC, useCallback, useState } from 'react';
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
    updateMarker: (marker: Marker) => void;
};

type AutocompleteInstance = google.maps.places.Autocomplete;

export const MarkerInput: FC<Props> = ({ marker, updateMarker, isLoaded }) => {
    const locationId = `location-${marker.id}`;
    const labelId = `label-${marker.id}`;
    const [internalLocation, setInternalLocation] = useState<string>(marker.location?.name || '');
    const [selectedLocation, setSelectedLocation] = useState<string>(marker.location?.name || '');
    const [label, setLabel] = useState<string>(marker.label);
    const [locationInputStyle, setLocationInputStyle] = useState<FormControlStyle>(FormControlStyle.Primary);
    const [locationInputHelperText, setLocationInputHelperText] = useState<string>('');

    const debouncedUpdateMarker = useCallback<(marker: Marker) => void>(
        debounce((marker: Marker) => {
            updateMarker(marker);
        }, 150),
        [updateMarker, marker]
    );

    const [autocomplete, setAutocomplete] = useState<AutocompleteInstance>();

    const onLoad = (autocomplete: AutocompleteInstance) => {
        if (autocomplete) {
            setAutocomplete(autocomplete);
        }
    };

    const resetLocationInput = () => {
        setLocationInputHelperText('');
        setLocationInputStyle(FormControlStyle.Primary);
    };

    function onPlaceChanged() {
        const place = autocomplete?.getPlace();
        // Check for place_id as well since hitting enter while typing without selecting a place passes an unknown place with the given string as it's name
        if (place?.name && place?.place_id) {
            setInternalLocation(place.name);
            setSelectedLocation(place.name);
            resetLocationInput();
            debouncedUpdateMarker({
                ...marker,
                location: {
                    name: place.name || '',
                    placeId: place.place_id || '',
                    lat: place.geometry?.location?.lat() || 0,
                    lng: place.geometry?.location?.lng() || 0,
                },
            });
        }
    }

    if (!isLoaded) {
        return <div>Loading....</div>;
    }

    return (
        <div className={'tw-w-full'}>
            <Stack padding={'none'} spacing={'s'}>
                <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged} className={'tw-w-full'}>
                    <FormControl
                        clickable
                        direction={FormControlDirection.Vertical}
                        label={{
                            children: 'Location',
                            htmlFor: locationId,
                            required: true,
                        }}
                        helper={locationInputHelperText ? { text: locationInputHelperText } : undefined}
                        style={locationInputStyle}
                    >
                        <TextInput
                            id={locationId}
                            value={internalLocation}
                            type={TextInputType.Text}
                            required={true}
                            onChange={(newLocation) => {
                                setInternalLocation(newLocation);
                            }}
                            onBlur={() => {
                                if (internalLocation !== selectedLocation) {
                                    setLocationInputHelperText('Please select a suggested place from the dropdown!');
                                    setLocationInputStyle(FormControlStyle.Danger);
                                } else {
                                    resetLocationInput();
                                }
                            }}
                        />
                    </FormControl>
                </Autocomplete>
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
                            debouncedUpdateMarker({ ...marker, label: newLabel });
                        }}
                    />
                </FormControl>
            </Stack>
        </div>
    );
};
