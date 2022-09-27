import React, { FC, Fragment, useState } from 'react';
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
import { Location, Marker } from './types';

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
    const [location, setLocation] = useState<Location>(marker.location);
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
        if (autocomplete?.getPlace().name) {
            setLocation({ address: autocomplete.getPlace().name || '' });
            debouncedSetMarker(
                {
                    ...marker,
                    location: {
                        address: autocomplete.getPlace().name || '',
                        lat: autocomplete?.getPlace().geometry?.location?.lat(),
                        lng: autocomplete?.getPlace().geometry?.location?.lng(),
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
        <Fragment key={index}>
            <Stack padding={'s'} spacing={'m'}>
                <FormControl
                    clickable
                    direction={FormControlDirection.Vertical}
                    label={{
                        children: 'Label',
                        htmlFor: labelId,
                        required: true,
                    }}
                    style={FormControlStyle.Primary}
                >
                    <TextInput
                        id={labelId}
                        value={label}
                        type={TextInputType.Text}
                        required={true}
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
                            value={location.address}
                            type={TextInputType.Text}
                            required={true}
                            onChange={(newAddress) => {
                                setLocation({ address: newAddress });
                                debouncedSetMarker({ ...marker, location: { address: newAddress } }, index);
                            }}
                        />
                    </FormControl>
                </Autocomplete>
            </Stack>
        </Fragment>
    );
};
