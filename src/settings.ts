import { IconEnum } from '@frontify/fondue';
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
        {
            id: 'showLabels',
            type: 'switch',
            defaultValue: false,
            label: 'Show labels on map',
        },
    ],
    [Sections.Layout]: [
        {
            id: 'customMapFormat',
            type: 'switch',
            label: 'Map format',
            switchLabel: 'Fixed height',
            defaultValue: false,
            on: [
                {
                    id: 'fixedHeight',
                    type: 'input',
                    placeholder: '500px',
                    rules: [
                        {
                            errorMessage: "Please use a numerical value with or without 'px'",
                            validate: (value: string) => value.match(/^\d+(?:px)?$/g) !== null,
                        },
                    ],
                },
            ],
            off: [
                {
                    id: 'formatPreset',
                    type: 'slider',
                    defaultValue: '16to9',
                    helperText: 'Choose the aspect ratio of the map',
                    choices: [
                        {
                            value: '16to9',
                            label: '16 / 9',
                        },
                        {
                            value: '4to3',
                            label: '4 / 3',
                        },
                        {
                            value: '1to1',
                            label: '1 / 1',
                        },
                    ],
                },
            ],
        },
    ],
};
