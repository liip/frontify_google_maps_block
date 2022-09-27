import { AppBridgeBlock, useBlockSettings } from '@frontify/app-bridge';
import { FC } from 'react';
import { Map } from './Map';
import { EmptyState } from './EmtpyState';
import { Marker, Settings } from './types';

type Props = {
    appBridge: AppBridgeBlock;
};

export const GoogleMapsBlock: FC<Props> = ({ appBridge }) => {
    const [blockSettings, setBlockSettings] = useBlockSettings<Settings>(appBridge);

    if (!blockSettings.apiKey) {
        return <EmptyState />;
    }

    const setMarkers = (markers: Marker[]) => {
        setBlockSettings({ markers });
    };

    return (
        <Map
            apiKey={blockSettings.apiKey}
            markers={blockSettings.markers || [{ location: { address: '', lat: 0, lng: 0 }, label: '' }]}
            setMarkers={setMarkers}
        />
    );
};
