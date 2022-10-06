import { AppBridgeBlock, useBlockSettings, useEditorState } from '@frontify/app-bridge';
import { FC } from 'react';
import { Map } from './Map';
import { EmptyState } from './EmtpyState';
import { Marker, Settings } from './types';

type Props = {
    appBridge: AppBridgeBlock;
};

export const GoogleMapsBlock: FC<Props> = ({ appBridge }) => {
    const isEditing = useEditorState(appBridge);
    const [blockSettings, setBlockSettings] = useBlockSettings<Settings>(appBridge);
    console.log(blockSettings);

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
            isEditing={isEditing}
            showLabelsByDefault={blockSettings.showLabels}
        />
    );
};
