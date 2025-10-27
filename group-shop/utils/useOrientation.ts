import * as ScreenOrientation from 'expo-screen-orientation';
import { useState, useEffect } from 'react';

export default function useOrientation() {
    const [orientation, setOrientation] = useState("");

    useEffect(() => {
        function getOrientation(orientationEnum : number) {
            if (orientationEnum === 1 || orientationEnum === 2) {
                return "Portrait";
            }

            return "Landscape";
        }

        function handleOrientation(event : ScreenOrientation.OrientationChangeEvent) {
            setOrientation(getOrientation(event.orientationInfo.orientation));
        }
            
        const subscription = ScreenOrientation.addOrientationChangeListener(handleOrientation);

        if (orientation === "") {
            ScreenOrientation.getOrientationAsync().then(orientationEnum => (orientationEnum === 1 || orientationEnum === 2) 
            ? setOrientation("Portrait") : setOrientation('Landscape'))
        }

        return () => ScreenOrientation.removeOrientationChangeListener(subscription);
    }, [orientation]);

    return orientation;
}