/* (c) Copyright Frontify Ltd., all rights reserved. */

import { AppBridgeBlock, useBlockSettings, useEditorState } from '@frontify/app-bridge';
import { Color, RichTextEditor } from '@frontify/fondue';
import { FC, useState } from 'react';
import { DEFAULT_BACKGROUND_COLOR, FULL_WIDTH } from './settings';
import style from './style.module.css';
import { GoogleMap, useLoadScript, useJsApiLoader, Marker } from '@react-google-maps/api';

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

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
    });

    if (!isLoaded) {
        return <div>Loading....</div>;
    }

    return (
        <div className={style.container}>
            <GoogleMap zoom={10} center={{ lat: 44, lng: -80 }} mapContainerClassName={style.mapContainer}></GoogleMap>
        </div>
    );
};
