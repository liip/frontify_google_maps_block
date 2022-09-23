import { AppBridgeBlock, useBlockSettings, useEditorState } from '@frontify/app-bridge';
import React, { FC } from 'react';
import { Map } from './Map';
import { EmptyState } from './EmtpyState';

export type Settings = {
    apiKey: string;
    customMapFormat: boolean;
    formatPreset: string;
    fixedHeight: string;
};

type Props = {
    appBridge: AppBridgeBlock;
};

export const GoogleMapsBlock: FC<Props> = ({ appBridge }) => {
    const isEditing = useEditorState(appBridge);
    const [blockSettings] = useBlockSettings<Settings>(appBridge);

    if (!blockSettings.apiKey) {
        return <EmptyState />;
    }

    return <Map settings={blockSettings} isEditing={isEditing} />;
};
