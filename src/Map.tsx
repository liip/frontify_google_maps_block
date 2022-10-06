import React, { FC, Fragment, useCallback, useEffect, useState } from 'react';
import style from './style.module.css';
import { GoogleMap, InfoWindow, Marker, useLoadScript } from '@react-google-maps/api';
import { Marker as MarkerType } from './types';
import { MarkerInput } from './MarkerInput';
import { Button, ButtonRounding, ButtonStyle, ButtonType, IconPlus, IconTrashBin, Stack } from '@frontify/fondue';

type Props = {
    apiKey: string;
    markers?: MarkerType[];
    setMarkers: (markers: MarkerType[]) => void;
    isEditing: boolean;
    showLabelsByDefault: boolean;
};

type MapType = google.maps.Map;

type LibraryConfig = ('places' | 'drawing' | 'geometry' | 'localContext' | 'visualization')[];

const libraries: LibraryConfig = ['places'];

export const Map: FC<Props> = ({ apiKey, markers = [], setMarkers, isEditing, showLabelsByDefault }) => {
    const initialMapCenter = { lat: 47.394144, lng: 0.68484 };

    const [map, setMap] = useState<MapType>();

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: apiKey,
        libraries,
    });

    const [showLabels, setShowLabels] = useState(showLabelsByDefault);
    const showLabelsMarkers = (e: any) => {
        // When I click on a marker, it shows or hide every labels
        // I want to show or hide only the marker's label from which I click
        setShowLabels(!showLabels);
        console.log('e', e);
        console.log('showLabels', showLabels);
    };

    const onLoad = useCallback((map) => setMap(map), []);

    useEffect(() => {
        if (map) {
            map.fitBounds(bounds);
        }
    }, [map, markers, isEditing, showLabelsByDefault]);

    if (!isLoaded) {
        return <div>Loading....</div>;
    }

    const bounds = new window.google.maps.LatLngBounds();

    const setMarker = (marker: MarkerType, index: number) => {
        const newMarkers = [...markers];
        newMarkers[index] = marker;
        setMarkers(newMarkers);
        console.log('newMarkers', newMarkers);
    };

    const deleteMarker = (marker: MarkerType, index: number) => {
        setMarkers(markers.filter((marker) => marker !== markers[index]));
    };

    const labelStyles = {
        color: 'black',
        padding: '0 8px',
    };

    return (
        <div>
            <GoogleMap zoom={10} center={initialMapCenter} mapContainerClassName={style.containerMap} onLoad={onLoad}>
                {markers
                    ? markers
                          .filter((marker) => marker.location?.lat && marker.location?.lng)
                          .map((marker, index) => {
                              bounds.extend({
                                  lat: Number(marker.location.lat),
                                  lng: Number(marker.location.lng),
                              });
                              return (
                                  <Marker
                                      key={index}
                                      position={{ lat: Number(marker.location.lat), lng: Number(marker.location.lng) }}
                                      onClick={(e) => showLabelsMarkers(e)}
                                  >
                                      {showLabels && (
                                          <InfoWindow options={{ maxWidth: 200 }}>
                                              <div style={labelStyles}>
                                                  <h1>{marker.label}</h1>
                                              </div>
                                          </InfoWindow>
                                      )}
                                  </Marker>
                              );
                          })
                    : ''}
            </GoogleMap>
            {isEditing && (
                <Fragment>
                    {markers.map((marker, index) => {
                        return (
                            <Stack spacing={'s'} padding={'xs'} align={'end'} key={index}>
                                <MarkerInput marker={marker} index={index} setMarker={setMarker} isLoaded={isLoaded} />
                                <Button
                                    type={ButtonType.Button}
                                    onClick={() => deleteMarker(marker, index)}
                                    rounding={ButtonRounding.Medium}
                                    icon={<IconTrashBin />}
                                    style={ButtonStyle.Secondary}
                                />
                            </Stack>
                        );
                    })}
                    <Stack spacing={'s'} padding={'xs'}>
                        <Button
                            type={ButtonType.Button}
                            onClick={() =>
                                setMarker({ location: { address: '', lat: 0, lng: 0 }, label: '' }, markers?.length)
                            }
                            rounding={ButtonRounding.Medium}
                            icon={<IconPlus />}
                            style={ButtonStyle.Secondary}
                        >
                            Add new Location Marker
                        </Button>
                    </Stack>
                </Fragment>
            )}
        </div>
    );
};
