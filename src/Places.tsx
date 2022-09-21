import {
    Combobox,
    ComboboxInput,
    ComboboxList,
    ComboboxOption,
    ComboboxOptionText,
    ComboboxPopover,
} from '@reach/combobox';
import React, { FC, useMemo, useState } from 'react';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import style from './style.module.css';

type Props = {
    props: any;
};

export const Places: FC<Props> = ({ setSelected }) => {
    const {
        ready,
        value, // what the user typed in
        setValue,
        suggestions: { status, data },
        clearSuggestions,
    } = usePlacesAutocomplete();

    const handleSelect = async (address: string) => {
        setValue(address, false);
        clearSuggestions();

        // Change the address string into geo code using getGeocode helper
        const results = await getGeocode({ address });
        console.log('geo code', results);

        // Convert the result into lat and lng using getLatLng helper
        const { lat, lng } = await getLatLng(results[0]);
        console.log('lat, lng', lat, lng);

        setSelected({ lat, lng });
    };

    return (
        <div className={style.container}>
            <Combobox onSelect={handleSelect}>
                {/*
                    With the onChange event, I call setValue function
                    This function will change the content of value
                */}
                <ComboboxInput
                    value={value}
                    onChange={(e: any) => setValue(e.target.value)}
                    disabled={!ready}
                    className={style.input}
                    placeholder="Search an address"
                />
                <ComboboxPopover>
                    <ComboboxList>
                        {/* To show all the suggestion results */}
                        {/* {status === 'OK' && */}
                        {console.log(data)}
                        {status === 'OK' &&
                            data.map((description: string, place_id: string) => {
                                <ComboboxOption key={place_id} value={description} />;
                            })}
                    </ComboboxList>
                </ComboboxPopover>
            </Combobox>
        </div>
    );
};
