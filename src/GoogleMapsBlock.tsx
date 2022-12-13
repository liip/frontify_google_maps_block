import { AppBridgeBlock, useBlockSettings, useEditorState, useReadyForPrint } from '@frontify/app-bridge';
import React, { FC } from 'react';

import { EmptyState } from './EmtpyState';
import { Map } from './Map';
import { Settings } from './types';

type Props = {
    appBridge: AppBridgeBlock;
};

export const GoogleMapsBlock: FC<Props> = ({ appBridge }) => {
    const isEditing = useEditorState(appBridge);
    const [blockSettings, setBlockSettings] = useBlockSettings<Settings>(appBridge);
    const { setIsReadyForPrint } = useReadyForPrint(appBridge);

    if (!blockSettings.apiKey) {
        return <EmptyState />;
    }

    return (
        <Map
            isEditing={isEditing}
            settings={blockSettings}
            setSettings={setBlockSettings}
            setIsReadyForPrint={setIsReadyForPrint}
        />
    );
};
