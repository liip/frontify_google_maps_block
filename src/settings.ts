import { AssetInputMode, BlockSettingsStructureExport, Bundle, Sections } from '@frontify/guideline-blocks-settings';

export const settings: BlockSettingsStructureExport = {
    [Sections.Main]: [
        {
            id: 'apiKey',
            type: 'input',
            defaultValue: '',
            placeholder: 'Paste your API Key here',
            label: 'Google Maps API Key',
        },
    ],
    [Sections.Basics]: [
        {
            id: 'allowMapControls',
            type: 'switch',
            label: 'Allow Map Controls',
            defaultValue: true,
        },
        {
            id: 'markerIconEnabled',
            type: 'switch',
            label: 'Custom Map Marker',
            defaultValue: false,
            on: [
                {
                    id: 'markerIcon',
                    type: 'assetInput',
                    mode: AssetInputMode.UploadOnly,
                    onChange: async (bundle: Bundle) => {
                        // Wait for value to be exposed with bundle.getBlock('markerIcon')
                        const assets = await bundle.getAppBridge().getBlockAssets();
                        const genericImageUrl = assets.markerIcon[0].genericUrl;
                        bundle.setBlockValue('markerIcon', genericImageUrl);
                    },
                },
            ],
        },
        {
            id: 'mapStyleEnabled',
            type: 'switch',
            label: 'Custom Map Style',
            info: 'Create a new style on mapstyle.withgoogle.com, and paste the generated JSON into this field',
            defaultValue: false,
            on: [
                {
                    id: 'mapStyle',
                    type: 'textarea',
                    defaultValue: '[]',
                    rules: [
                        {
                            errorMessage: 'Invalid JSON, try using https://mapstyle.withgoogle.com',
                            validate: (value: string) => {
                                try {
                                    JSON.parse(value);
                                    return true;
                                } catch (error) {
                                    return false;
                                }
                            },
                        },
                    ],
                },
            ],
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
