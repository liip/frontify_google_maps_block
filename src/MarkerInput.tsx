import React, { FC, useCallback, useState } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import {
    FormControl,
    FormControlDirection,
    FormControlStyle,
    Stack,
    TextInput,
    TextInputType,
    Textarea,
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
    const [internalLabel, setInternalLabel] = useState<string>(marker.location?.address || '');
    const [selectedLabel, setSelectedLabel] = useState<string>(marker.location?.address || '');
    const [label, setLabel] = useState<string>(marker.label);
    const [addressInputStyle, setAddressInputStyle] = useState<FormControlStyle>(FormControlStyle.Primary);
    const [addressInputHelperText, setAddressInputHelperText] = useState<string>('');

    const debouncedUpdateMarker = useCallback(
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

    const resetAddressInput = () => {
        setAddressInputHelperText('');
        setAddressInputStyle(FormControlStyle.Primary);
    };

    function onPlaceChanged() {
        const place = autocomplete?.getPlace();
        if (place?.name) {
            setInternalLabel(place.name);
            setSelectedLabel(place.name);
            resetAddressInput();
            debouncedUpdateMarker({
                ...marker,
                location: {
                    address: place.name || '',
                    placeId: place.place_id,
                    lat: place.geometry?.location?.lat(),
                    lng: place.geometry?.location?.lng(),
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
                        helper={addressInputHelperText ? { text: addressInputHelperText } : undefined}
                        style={addressInputStyle}
                    >
                        <TextInput
                            id={locationId}
                            value={internalLabel}
                            type={TextInputType.Text}
                            required={true}
                            onChange={(newLabel) => {
                                setInternalLabel(newLabel);
                            }}
                            onBlur={() => {
                                if (internalLabel !== selectedLabel) {
                                    setAddressInputHelperText('Please select a suggested place from the dropdown!');
                                    setAddressInputStyle(FormControlStyle.Danger);
                                } else {
                                    resetAddressInput();
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
