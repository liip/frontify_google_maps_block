import { AppBridgeBlock, useBlockSettings } from '@frontify/app-bridge';
import { FC } from 'react';
import { Map } from './Map';
import { EmptyState } from './EmtpyState';

type Settings = {
    apiKey: string;
};

type Props = {
    appBridge: AppBridgeBlock;
};

export const GoogleMapsBlock: FC<Props> = ({ appBridge }) => {
    const [blockSettings] = useBlockSettings<Settings>(appBridge);

    if (!blockSettings.apiKey) {
        return <EmptyState />;
    }

    return <Map apiKey={blockSettings.apiKey} />;
};
