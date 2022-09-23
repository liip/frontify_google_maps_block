import React, { FC, useState } from 'react';
import style from './style.module.css';
import { Autocomplete, GoogleMap, useLoadScript } from '@react-google-maps/api';
import { Settings } from './GoogleMapsBlock';
import { FormControl, TextInput } from '@frontify/fondue';

type Props = {
    settings: Settings;
    isEditing: boolean;
};

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

type AutocompleteInstance = google.maps.places.Autocomplete;

type LibraryConfig = ('places' | 'drawing' | 'geometry' | 'localContext' | 'visualization')[];

const libraries: LibraryConfig = ['places'];

export const Map: FC<Props> = ({ isEditing, settings }) => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: settings.apiKey,
        libraries,
    });
    const [term, setTerm] = useState('');
    const [autocomplete, setAutocomplete] = useState<AutocompleteInstance>();

    function onLoad(autocomplete: AutocompleteInstance) {
        if (autocomplete) {
            setAutocomplete(autocomplete);
        }
    }

    function onPlaceChanged() {
        if (autocomplete?.getPlace().name) {
            setTerm(autocomplete.getPlace().name || '');
        } else {
            console.log('Autocomplete is not loaded yet!');
        }
    }

    if (!isLoaded) {
        return <div>Loading....</div>;
    }

    return (
        <div
            className={
                !settings.customMapFormat
                    ? [style.mapContainerOuter, mapClassNames[settings.formatPreset].outer].join(' ')
                    : undefined
            }
            style={settings.customMapFormat ? { height: parseInt(settings.fixedHeight) } : undefined}
        >
            <GoogleMap
                zoom={10}
                center={{ lat: 44, lng: -80 }}
                mapContainerClassName={
                    !settings.customMapFormat
                        ? [style.mapContainerInner, mapClassNames[settings.formatPreset].inner].join(' ')
                        : style.mapContainerCustom
                }
            ></GoogleMap>
            {isEditing && (
                <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                    <FormControl label={{ children: 'Places Autocomplete Baby', htmlFor: 'placesExample' }}>
                        <TextInput value={term} onChange={(v) => setTerm(v)} />
                    </FormControl>
                </Autocomplete>
            )}
        </div>
    );
};
