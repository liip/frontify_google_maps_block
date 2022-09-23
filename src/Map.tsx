import React, { FC, useState } from 'react';
import style from './style.module.css';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
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

type Props = {
    apiKey: string;
};

export const Map: FC<Props> = ({ apiKey }) => {
    const [latitude, setLatitude] = useState<number>(0);
    const [longitude, setLongitude] = useState<number>(0);
    const [centerGoogleMap, setCenterGoogleMap] = useState({ lat: 47.394144, lng: 0.68484 });
    const [disabled, setDisabled] = useState(true);

    const [bounds, setBounds] = useState([{ lat: latitude, lng: longitude }]);

    // TODO
    // Clean input on submit
    // Value must be between .... and ....
    // Allowed negative value

    const handleBoundsMarkers = (newMarkers: any) => {
        // google is not defined ?
        // When I click on onSubmit to add a marker
        // I want to add this marker into a new array
        // let bounds = new google.maps.LatLng(latitude, longitude);
        setBounds([...bounds, newMarkers]);
        console.log('bounds', bounds);
    };

    const handleLatitude = (latitude: string): void => {
        setLatitude(Number(latitude));
        handleDisabled();
    };

    const handleLongitude = (longitude: string): void => {
        setLongitude(Number(longitude));
        handleDisabled();
    };

    const handleSubmit = (location: any) => {
        // Refactoring
        // location object --> target property
        location.preventDefault();
        setLatitude(Number(location.target[1].value));
        setLongitude(Number(location.target[3].value));
        setCenterGoogleMap({ lat: latitude, lng: longitude });
        handleBoundsMarkers({ lat: latitude, lng: longitude });
    };

    const handleDisabled = (): void => {
        if (latitude !== 0 || longitude !== 0) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    };

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: apiKey,
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
                        <FormControl
                            clickable
                            direction={FormControlDirection.Vertical}
                            extra=""
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

                    <div className={style.containerInputLongitude}>
                        <FormControl
                            clickable
                            direction={FormControlDirection.Vertical}
                            extra=""
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
            </div>
        </div>
    );
};
