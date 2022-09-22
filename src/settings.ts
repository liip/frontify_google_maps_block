import { BlockSettings, Sections } from '@frontify/guideline-blocks-settings';

export const settings: BlockSettings = {
    [Sections.Basics]: [
        {
            id: 'apiKey',
            type: 'input',
            defaultValue: '',
            placeholder: 'Paste your API Key here',
            label: 'Google Maps API Key',
        },
    ],
};
