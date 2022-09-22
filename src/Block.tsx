/* (c) Copyright Frontify Ltd., all rights reserved. */
import { AppBridgeBlock, useBlockSettings, useEditorState } from '@frontify/app-bridge';
import {
    Button,
    ButtonRounding,
    ButtonSize,
    ButtonStyle,
    ButtonType,
    Color,
    FormControl,
    FormControlDirection,
    FormControlStyle,
    RichTextEditor,
    TextInput,
    TextInputType,
} from '@frontify/fondue';
import React, { FC, useState } from 'react';
import { DEFAULT_BACKGROUND_COLOR, FULL_WIDTH } from './settings';
import style from './style.module.css';
import { GoogleMap, useLoadScript, useJsApiLoader, Marker } from '@react-google-maps/api';
import { useRef } from 'react';

type Settings = {
    width: string;
    backgroundColor: Color;
    textValue: string;
    showRichTextEditor: boolean;
};

type Props = {
    appBridge: AppBridgeBlock;
};

const toRgbaString = (color: Color): string => {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
};

export const AnExampleBlock: FC<Props> = ({ appBridge }) => {
    // const isEditing = useEditorState(appBridge);
    // const [blockSettings, setBlockSettings] = useBlockSettings<Settings>(appBridge);

    // const {
    //     width = FULL_WIDTH,
    //     showRichTextEditor = true,
    //     backgroundColor = DEFAULT_BACKGROUND_COLOR,
    //     textValue,
    // } = blockSettings;

    // const onTextChange = (value: string): Promise<void> => setBlockSettings({ ...blockSettings, textValue: value });

    // const customStyles = {
    //     width,
    //     backgroundColor: toRgbaString(backgroundColor),
    // };

    const [latitude, setLatitude] = useState<number>(0);
    const [longitude, setLongitude] = useState<number>(0);
    const [centerGoogleMap, setCenterGoogleMap] = useState({ lat: 47.394144, lng: 0.68484 });
    const [disabled, setDisabled] = useState(true);

    const handleLatitude = (latitude: string): void => {
        // Convert string from input value into number
        // Because type useState is number
        // ATTENTION ! onChange event on <TextInput /> returns the input value directly
        // Not an event object : e.target.value doesn't work
        setLatitude(Number(latitude));
        handleDisabled();
    };

    const handleLongitude = (longitude: string): void => {
        // Convert string from input value into number
        // Because type useState is number
        // ATTENTION ! onChange event on <TextInput /> returns the input value directly
        // Not an event object : e.target.value doesn't work
        setLongitude(Number(longitude));
        handleDisabled();
    };

    const handleSubmit = (location: any) => {
        // ATTENTION ! onSubmit sends the event objet
        location.preventDefault();
        console.log(location);
        // For code reviewer : See location in the console
        // Why 3 times <button> into 'target' ?
        setLatitude(Number(location.target[1].value));
        setLongitude(Number(location.target[3].value));
        // Change google map center only on submit
        setCenterGoogleMap({ lat: latitude, lng: longitude });
    };

    const handleDisabled = (): void => {
        if (latitude !== 0 || longitude !== 0) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    };

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
    });

    if (!isLoaded) {
        return <div>Loading....</div>;
    }

    return (
        <div className={style.container}>
            <GoogleMap zoom={10} center={centerGoogleMap} mapContainerClassName={style.containerMap}>
                <Marker position={{ lat: latitude, lng: longitude }} />
            </GoogleMap>

            <div className={style.containerInputs}>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div className={style.containerInputLatitude}>
                        {/* LATITUDE */}
                        <FormControl
                            clickable
                            direction={FormControlDirection.Vertical}
                            extra=""
                            helper={{
                                position: 'After',
                                text: '',
                            }}
                            label={{
                                children: 'Latitude',
                                htmlFor: 'id-856267979',
                                required: false,
                                tooltip: {
                                    content: 'Tooltip Text',
                                },
                            }}
                            style={FormControlStyle.Primary}
                        >
                            <TextInput
                                onChange={handleLatitude}
                                value={latitude.toString()}
                                type={TextInputType.Text}
                            />
                        </FormControl>
                    </div>

                    {/* LONGITUDE */}
                    <div className={style.containerInputLongitude}>
                        <FormControl
                            clickable
                            direction={FormControlDirection.Vertical}
                            extra=""
                            helper={{
                                position: 'After',
                                text: '',
                            }}
                            label={{
                                children: 'Longitude',
                                htmlFor: 'id-856267979',
                                required: false,
                                tooltip: {
                                    content: 'Tooltip Text',
                                },
                            }}
                            style={FormControlStyle.Primary}
                        >
                            <TextInput
                                onChange={handleLongitude}
                                value={longitude.toString()}
                                type={TextInputType.Text}
                            />
                        </FormControl>
                    </div>
                    <div className={style.containerBtnSubmit}>
                        <Button
                            hugWidth
                            onClick={handleSubmit}
                            rounding={ButtonRounding.Medium}
                            size={ButtonSize.Medium}
                            style={ButtonStyle.Positive}
                            type={ButtonType.Submit}
                            disabled={disabled}
                        >
                            Submit Location
                        </Button>
                    </div>
                </form>
                <br />
                <div>
                    Latitude: {typeof latitude} {latitude}
                </div>
                <div>
                    Longitude : {typeof longitude} {longitude}
                </div>
            </div>
        </div>
    );
};
