import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { useEffect, useRef, useMemo, useCallback } from "react";
import * as ol from "ol";
import { fromLonLat, toLonLat } from 'ol/proj';
import 'ol/ol.css';
import TileLayer from "ol/layer/Tile";
import * as olSource from "ol/source";
import { useTheme } from "next-themes";
import { reverseGeocode } from "@/actions/fetchAddress";
import { setDeparture, setLoading, setLocation } from "@/redux/createRide/createRideSlice";

export function useMap(type: "departure" | "destination") {
  const mapRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch()
  const mapInstance = useRef<ol.Map | null>(null);
  const centerMarkerRef = useRef<HTMLDivElement>(null);
  const { departure, destination } = useAppSelector(state => state.createRide);
  const { theme } = useTheme()
  const styleId = theme === 'light' ? 'light-v10' : 'dark-v10';

  const updateLocation = useCallback(debounce(async (longitude: number, latitude: number) => {
    const zoom = mapInstance.current?.getView().getZoom();
    if (zoom && zoom < 14) return;

    const current = type === "departure" ? departure : destination;
    if (current && haversineDistance(
      [current.longitude, current.latitude],
      [longitude, latitude]
    ) < 50) return;

    dispatch(setLoading({ type, loading: true }))
    try {
      const address = await reverseGeocode(latitude, longitude);
      console.log(address)
      dispatch(setLocation({ type, location: address }));
      dispatch(setLoading({ type, loading: false }))
    } catch (error) {
      console.error('Geocoding failed:', error);
    }
  }, 500), [type, departure, destination]);

  const location = useMemo(() => {
    return type === "departure" ? departure : destination;
  }, [type, departure?.latitude, departure?.longitude,
    destination?.latitude, destination?.longitude]);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstance.current) {
      const initialCenter = location
        ? fromLonLat([location.longitude, location.latitude])
        : fromLonLat([0, 0]);

      const map = new ol.Map({
        target: mapRef.current,
        view: new ol.View({
          center: initialCenter,
          zoom: 18,
        }),
        layers: []
      });
      const mapboxLayer = new TileLayer({
        source: new olSource.XYZ({
          url: `/api/mapbox?style=${styleId}&z={z}&x={x}&y={y}`,
          attributions: '© Mapbox'
        })
      });
      map.addLayer(mapboxLayer);

      let movementTimer: NodeJS.Timeout;
      const movementHandler = () => {
        if (centerMarkerRef.current) {
          centerMarkerRef.current.classList.add('animate-pulse');
        }

        clearTimeout(movementTimer);
        movementTimer = setTimeout(() => {
          const center = map.getView().getCenter();
          if (center) {
            const [longitude, latitude] = toLonLat(center);
            if (latitude && longitude)
              updateLocation(longitude, latitude);

            if (centerMarkerRef.current) {
              centerMarkerRef.current.classList.remove('animate-pulse');
            }
          }
        }, 500);
      };
      map.on('movestart', () => {
        if (centerMarkerRef.current) {
          centerMarkerRef.current.classList.add('animate-pulse');
        }
      });

      map.on('moveend', movementHandler);

      mapInstance.current = map;

      return () => {
        map.un('moveend', movementHandler);
        map.un('movestart', () => { });
        map.setTarget(undefined);
        mapInstance.current = null;
      };
    } else if (location) {
      const view = mapInstance.current.getView();
      view.setCenter(fromLonLat([location.longitude, location.latitude]));

      return () => {
        if (mapInstance.current) {
          mapInstance.current.setTarget(undefined);
          mapInstance.current = null;
        }
      };
    }
  }, [location, updateLocation]);

  return {
    mapRef,
    mapInstance,
    centerMarkerRef
  };
}

type DebounceFunction<T extends (...args: any[]) => void> = {
  (this: ThisParameterType<T>, ...args: Parameters<T>): void;
  cancel: () => void;
};

function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): DebounceFunction<T> {
  let timeout: NodeJS.Timeout | null = null;

  const debounced = function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    const later = () => {
      func.apply(this, args);
    };

    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  } as DebounceFunction<T>;

  debounced.cancel = () => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
}

function haversineDistance([lon1, lat1]: [number, number], [lon2, lat2]: [number, number]) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
