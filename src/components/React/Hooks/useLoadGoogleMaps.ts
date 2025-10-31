import { useEffect, useState } from 'react';

let isApiLoaded = false;
let loadPromise: Promise<void> | null = null;

declare global {
  interface Window {
    google: typeof google.maps;
  }
}

export default function useLoadGoogleMaps(): boolean {
  const [loaded, setLoaded] = useState(isApiLoaded);
  const apiKey = import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (isApiLoaded) {
      setLoaded(true);
      return;
    }

    if (!loadPromise) {
      loadPromise = new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.id = 'google-maps-script';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker,geometry&loading=async`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
          let attempts = 0;
          const maxAttempts = 100;
          const check = () => {
            if (window.google?.maps?.places && window.google.maps?.marker) {
              isApiLoaded = true;
              resolve();
            } else if (++attempts < maxAttempts) {
              requestAnimationFrame(check);
            } else {
              reject(
                'Google Maps libraries failed to initialize after timeout'
              );
            }
          };
          check();
        };

        script.onerror = () => {
          document.body.removeChild(script);
          reject('Google Maps failed to load');
        };
        document.body.appendChild(script);
      });
    }

    loadPromise.then(() => setLoaded(true)).catch((err) => console.error(err));
  }, [apiKey]);

  return loaded;
}
