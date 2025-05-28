import { useCallback, useEffect, useRef, useState } from "react";
import * as ol from "ol";
import 'ol/ol.css';
import { useTheme } from "next-themes";
import { fromLonLat } from "ol/proj";
import TileLayer from "ol/layer/Tile";
import * as olSource from "ol/source";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import { toast } from "@ridex/ui/components/sonner";
import { fetchRouteDetails, Route } from '@/actions/getRoutes'
import polyline from "@mapbox/polyline";
import { LineString, Point } from "ol/geom";
import { getMapCenter, getZoomLevel, haversineDistance } from "@/lib/mapUtils";
import * as olEasing from 'ol/easing';
import Icon from "ol/style/Icon";
import { setRoute } from "@/redux/createRide/createRideSlice";

export function useRouteMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<ol.Map | null>(null);
  const dispatch = useAppDispatch()
  const { departure, destination } = useAppSelector((state) => state.createRide);
  const { theme } = useTheme()
  const styleId = theme === 'light' ? 'light-v10' : 'dark-v10';
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number>(0);
  const [routes, setRoutes] = useState<Route[]>([]);
  const routeFeaturesRef = useRef<ol.Feature[]>([]);

  const vectorSourceRef = useRef(new VectorSource());
  const vectorLayerRef = useRef(new VectorLayer({ source: vectorSourceRef.current })
  );
  const markerSourceRef = useRef(new VectorSource());
  const markerLayerRef = useRef(
    new VectorLayer({ source: markerSourceRef.current })
  );

  useEffect(() => {
    if (!routes[selectedRouteIndex]?.polyline.encodedPolyline) return
    dispatch(setRoute({
      polyline: routes[selectedRouteIndex]?.polyline.encodedPolyline,
      ride_distance_m: routes[selectedRouteIndex]?.distanceMeters,
      ride_duration_s: routes[selectedRouteIndex]?.duration
    }))
  }, [selectedRouteIndex])

  const createMarkerFeature = useCallback((coords: [number, number], destination: boolean) => {
    const point = new Point(fromLonLat(coords));
    const feature = new ol.Feature({ geometry: point });

    feature.setStyle(
      new Style({
        image: new Icon({
          src: destination ? "/images/red-circle.png" : '/images/black-circle.png',
          scale: 0.04,
          anchor: [0.5, 0.5]
        })
      }));

    return feature;
  }, [])

  useEffect(() => {
    if (!mapRef.current || !departure || !destination) return;
    if (!mapInstance.current) {

      const center = getMapCenter([departure.longitude, departure.latitude], [destination.longitude, destination.latitude]);
      const distance = haversineDistance([departure.longitude, departure.latitude], [destination.longitude, destination.latitude]);
      const zoom = getZoomLevel(distance);

      const map = new ol.Map({
        target: mapRef.current,
        view: new ol.View({
          center,
          zoom,
        }),
        layers: [
          new TileLayer({
            source: new olSource.XYZ({
              url: `/api/mapbox?style=${styleId}&z={z}&x={x}&y={y}`,
              attributions: '© Mapbox'
            })
          }),
          vectorLayerRef.current,
          markerLayerRef.current
        ]
      })

      mapInstance.current = map;
    }
  }, [])

  useEffect(() => {
    if (!mapInstance.current) return
    const map = mapInstance.current
    const handleClick = (event: any) => {
      console.log("Clicked!", event)
      map.forEachFeatureAtPixel(event.pixel, (feature) => {
        const routeIndex = feature.get("routeIndex");
        if (typeof routeIndex === "number") {
          setSelectedRouteIndex(routeIndex);
        }
      });
    };

    map.on("click", handleClick);

    return () => map.un("click", handleClick);
  }, [])

  useEffect(() => {
    if (!mapInstance.current) return
    const map = mapInstance.current
    const handlePointerMove = (event: any) => {
      const pixel = map.getEventPixel(event.originalEvent);
      const hit = map.hasFeatureAtPixel(pixel);
      map.getTargetElement().style.cursor = hit ? 'pointer' : '';
    };

    map.on('pointermove', handlePointerMove);
    return () => {
      map.un('pointermove', handlePointerMove);
    };
  }, [mapInstance.current])

  useEffect(() => {
    if (!departure || !destination) return
    if (!mapInstance.current) return
    const fetchRoute = async () => {
      try {
        const routes = await fetchRouteDetails({ origin: departure, destination: destination })
        console.log("Routes:", routes)
        if (!routes) return
        setRoutes(routes);
        const source = vectorSourceRef.current;
        source.clear();
      } catch (error) {
        console.error(error)
        toast.error('Failed to fetch routes')
      }
    }
    fetchRoute()
  }, [departure, destination])

  useEffect(() => {
    if (!departure || !destination || !markerSourceRef.current) return;

    markerSourceRef.current.clear();

    const departureFeature = createMarkerFeature(
      [departure.longitude, departure.latitude], false
    );
    markerSourceRef.current.addFeature(departureFeature);

    const destinationFeature = createMarkerFeature(
      [destination.longitude, destination.latitude], true
    );
    markerSourceRef.current.addFeature(destinationFeature);

  }, [departure, destination]);

  useEffect(() => {
    if (!mapInstance.current || !routes) return
    const source = vectorSourceRef.current;
    source.clear();
    routeFeaturesRef.current = [];

    routes.forEach((route, index) => {
      if (index === selectedRouteIndex) return;

      const feature = createRouteFeature(route, index, false);
      if (feature) {
        source.addFeature(feature);
        routeFeaturesRef.current.push(feature);
      }
    });
    const selectedRoute = routes[selectedRouteIndex];
    const selectedFeature = createRouteFeature(selectedRoute, selectedRouteIndex, true);
    if (selectedFeature) {
      source.addFeature(selectedFeature);
      routeFeaturesRef.current.push(selectedFeature);

      const geometry = selectedFeature.getGeometry() as LineString;
      mapInstance.current?.getView().fit(geometry.getExtent(), {
        padding: [60, 60, 60, 60],
        duration: 350,
        easing: olEasing.inAndOut
      });
    }
  }, [routes, selectedRouteIndex])

  const createRouteFeature = useCallback((
    route: Route | undefined,
    index: number,
    isSelected: boolean
  ): ol.Feature | null => {
    {
      if (!route) return null;
      const points = route.polyline.encodedPolyline;
      if (!points) return null;

      const decodedCoords = polyline.decode(points);
      const olCoords = decodedCoords.map(([lat, lng]) => fromLonLat([lng, lat]));
      const line = new LineString(olCoords);
      const feature = new ol.Feature({ geometry: line });

      feature.set("routeIndex", index);

      feature.setStyle([
        new Style({
          stroke: new Stroke({
            color: "black",
            width: 12,
          }),
        }),
        new Style({
          stroke: new Stroke({
            color: isSelected ? "#0074D9" : "#AAAAAA",
            width: 8,
          }),
        }),
      ]);

      return feature;
    };
  }, [])

  return {
    mapRef,
    mapInstance,
    routes,
    selectedRouteIndex,
    setSelectedRouteIndex
  }
}