import { AppBridgeBlock, useBlockSettings, useEditorState } from '@frontify/app-bridge';
import React, { FC } from 'react';
import { Map } from './Map';
import { EmptyState } from './EmtpyState';
import { Marker, Settings } from './types';

type Props = {
    appBridge: AppBridgeBlock;
};

export const GoogleMapsBlock: FC<Props> = ({ appBridge }) => {
    const isEditing = useEditorState(appBridge);
    const [blockSettings, setBlockSettings] = useBlockSettings<Settings>(appBridge);

    if (!blockSettings.apiKey) {
        return <EmptyState />;
    }

    const setMarkers = (markers: Marker[]) => {
        setBlockSettings({ markers });
    };
    const setMapState = (zoom: number, center: google.maps.LatLng | google.maps.LatLngLiteral) => {
        setBlockSettings({ mapZoom: zoom, mapCenter: center });
    };

    return (
        <Map
            setMarkers={setMarkers}
            setMapState={setMapState}
            isEditing={isEditing}
            settings={blockSettings}
        />
    );
};
