import { FC } from 'react';
import { Heading, Stack, Text } from '@frontify/fondue';

export const EmptyState: FC = () => {
    return (
        <div>
            <Stack direction="column" padding={'m'} spacing={'s'}>
                <Heading size={'x-large'}>How to get started</Heading>
                <Text as={'p'}>Add a Google Maps API key in the block settings to enable the Map.</Text>
                <a
                    href={'https://developers.google.com/maps/documentation/javascript/get-api-key'}
                    target={'_blank'}
                    rel="noreferrer"
                >
                    Find more information on Google Maps Platform
                </a>
            </Stack>
        </div>
    );
};
