import { FC } from 'react';
import style from './style.module.css';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';

type Props = {
    apiKey: string;
};

export const Map: FC<Props> = ({ apiKey }) => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: apiKey,
    });

    if (!isLoaded) {
        return <div>Loading....</div>;
    }

    return (
        <div className={style.container}>
            <GoogleMap zoom={10} center={{ lat: 44, lng: -80 }} mapContainerClassName={style.mapContainer}></GoogleMap>
        </div>
    );
};
