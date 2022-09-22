import React, { FC } from 'react';
import style from './style.module.css';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import { Settings } from './GoogleMapsBlock';

type Props = {
    settings: Settings;
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

export const Map: FC<Props> = ({ settings }) => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: settings.apiKey,
    });

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
        </div>
    );
};
