"use client";

import L, { LatLngTuple, GeoJSON as LeafletGeoJSON } from "leaflet";
import { useEffect, useRef } from "react";
import "@/lib/leaflet-splitmap";
import "leaflet-fullscreen";
import "leaflet-measure";
import "leaflet-easyprint";

import { getRuntimeConfig } from "@/utils/runtimeConfig";

import { COGServerResponse, Deposit } from "@/lib/definition";
import { load_edna_data } from "@/lib/edna_functions";
import { bindMapMoveToUrl, bindMapRequestPredOrDepthAtClick, getInitialView } from "@/utils/mapUtils";
import { load_gcrmn_data } from "@/lib/gcrmn_functions";
import { create_deposits_geojson } from "@/lib/geojson_functions";
import { load_comparison_zones } from "@/lib/comparison_functions";

const LEFT_GEOJSON_PANE_NAME = "leftGeojsonPane";
const RIGHT_GEOJSON_PANE_NAME = "rightGeojsonPane";

export interface LeafletSplitMapProps {
    leftUrls: COGServerResponse[];
    rightUrls: COGServerResponse[];
    withASV: boolean;
    withMarker: boolean;
    withComparisonMap: boolean;
    leftDeposits: Deposit[];
    rightDeposits: Deposit[];
}

// Fix marker icons if needed
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "/leaflet/marker_empty.svg",
    iconUrl: "/leaflet/marker_empty.svg",
    shadowUrl: "/leaflet/marker-shadow.png",
});

// This piece of code correct a bug with leaflet-measure where the map move on click. https://github.com/ljagis/leaflet-measure/issues/171
// @ts-ignore (no correct types)
L.Control.Measure.include({
    // set icon on the capture marker
    _setCaptureMarkerIcon: function () {
        // disable autopan
        this._captureMarker.options.autoPanOnFocus = false;

        // default function
        this._captureMarker.setIcon(
            L.divIcon({
                iconSize: this._map.getSize().multiplyBy(2),
            })
        );
    },
});

export default function LeafletMapCompare({
    leftUrls,
    rightUrls,
    withASV,
    withMarker,
    withComparisonMap,
    leftDeposits,
    rightDeposits,
}: LeafletSplitMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const splitRef = useRef<any>(null);
    const layersRef = useRef<L.TileLayer[]>([]);
    const urlsRef = useRef({ left: leftUrls, right: rightUrls, with_asv: withASV, with_marker: withMarker });
    const markersRef = useRef<L.Marker[]>([]);
    const comparisonZonesRef = useRef<LeafletGeoJSON[]>([]);

    const geoJsonLayerRef = useRef<LeafletGeoJSON[]>([]);

    // Update this value to always get the new one.
    // ! I don't set deposits because we just need to update deposits before layers to avoid an unnecessary refresh
    useEffect(() => {
        urlsRef.current = { left: leftUrls, right: rightUrls, with_asv: withASV, with_marker: withMarker };
    }, [leftUrls, rightUrls, withASV]);

    useEffect(() => {
        if (!mapRef.current) return;

        const { lat, lng, zoom } = getInitialView();

        // Initialize map only once
        const map = L.map(mapRef.current, {
            center: [lat, lng] as LatLngTuple,
            zoom: zoom,
            minZoom: 5,
            //@ts-ignore
            fullscreenControl: true,
        });

        // Add scale at the bottom of the map.
        L.control.scale({ maxWidth: 150, imperial: false }).addTo(map);

        L.control
            // @ts-ignore (no correct types)
            .measure({
                position: "topleft",
                primaryLengthUnit: "meters",
                secondaryLengthUnit: "kilometers",
                primaryAreaUnit: "hectares",
                secondaryAreaUnit: "sqmeters",
                localization: "fr",
            })
            .addTo(map);

        // @ts-ignore (no correct types)
        L.easyPrint({
            position: "topright",
            sizeModes: ["Current", "A4Portrait", "A4Landscape"],
            filename: "seatizen-monitoring-map",
            exportOnly: true,
            hideControlContainer: false,
        }).addTo(map);

        // Setup the map backgound.
        L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
            attribution: "&copy; Tiles © Esri",
            maxZoom: 28,
        }).addTo(map);

        L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/light_only_labels/{z}/{x}/{y}{r}.png", {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        }).addTo(map);

        // Setup listener.
        const cleanupClickHandler = bindMapRequestPredOrDepthAtClick(map, splitRef, urlsRef);
        const cleanupMoveHandler = bindMapMoveToUrl(map);

        // Keep ref to map.
        mapRef.current = map as any;

        // Create two custom panes before adding layers.
        map.createPane(LEFT_GEOJSON_PANE_NAME);
        map.createPane(RIGHT_GEOJSON_PANE_NAME);

        return () => {
            cleanupMoveHandler();
            cleanupClickHandler();

            map.remove();
        };
    }, []);

    // Update the map when we have new layers to show.
    useEffect(() => {
        if (!mapRef.current) return;
        const map = mapRef.current as unknown as L.Map;

        // Remove the splitpane to redraw it later.
        if (splitRef.current) {
            try {
                splitRef.current.remove();
            } catch (e) {
                console.warn("Failed to remove split instance:", e);
            }
        }

        // Remove all the layers to reprint it.
        layersRef.current.forEach((layer) => map.removeLayer(layer));
        layersRef.current = [];

        // Remove previous GeoJSON
        geoJsonLayerRef.current.forEach((geo) => map.removeLayer(geo));
        geoJsonLayerRef.current = [];

        // Append the left layers.
        const left_layers = [];
        for (const layer of leftUrls) {
            const tile = L.tileLayer(`${getRuntimeConfig().NEXT_PUBLIC_URL_COG_SERVER}${layer.url}?asv=${withASV}`, {
                attribution: layer.attribution,
                maxZoom: 28,
            }).addTo(map);
            left_layers.push(tile);
            layersRef.current.push(tile);
        }

        const geoJsonLayer_left = create_deposits_geojson(leftDeposits, map, LEFT_GEOJSON_PANE_NAME);
        if (geoJsonLayer_left) {
            left_layers.push(geoJsonLayer_left);
            geoJsonLayerRef.current.push(geoJsonLayer_left);
        }

        // Append the right layers.
        const right_layers = [];
        for (const layer of rightUrls) {
            const tile2 = L.tileLayer(`${getRuntimeConfig().NEXT_PUBLIC_URL_COG_SERVER}${layer.url}?asv=${withASV}`, {
                attribution: layer.attribution,
                maxZoom: 28,
            }).addTo(map);
            right_layers.push(tile2);
            layersRef.current.push(tile2);
        }

        const geoJsonLayer_right = create_deposits_geojson(rightDeposits, map, RIGHT_GEOJSON_PANE_NAME);
        if (geoJsonLayer_right) {
            right_layers.push(geoJsonLayer_right);
            geoJsonLayerRef.current.push(geoJsonLayer_right);
        }

        // Redraw the central splitpane.
        splitRef.current = L.control
            //@ts-ignore
            .splitMap(left_layers, right_layers)
            .addTo(map);

        const manageMarkers = async () => {
            if (withMarker && markersRef.current.length === 0) {
                // Load the eDNA data
                const ednaMarkers = await load_edna_data(map);
                markersRef.current = markersRef.current.concat(ednaMarkers);

                // Load GCRMN data
                const gcrmnMarkers = await load_gcrmn_data(map);
                markersRef.current = markersRef.current.concat(gcrmnMarkers);
            } else if (!withMarker && markersRef.current.length !== 0) {
                markersRef.current.forEach((marker) => marker.remove());
                markersRef.current = [];
            }
        };

        const manageComparisonZones = async () => {
            if (withComparisonMap && comparisonZonesRef.current.length === 0) {
                const comparison_zones = await load_comparison_zones(map);
                comparisonZonesRef.current = comparisonZonesRef.current.concat(comparison_zones);
            } else if (!withComparisonMap && comparisonZonesRef.current.length !== 0) {
                comparisonZonesRef.current.forEach((geo) => geo.remove());
                comparisonZonesRef.current = [];
            }
        };

        manageMarkers();
        manageComparisonZones();
    }, [leftUrls, rightUrls, withASV, withMarker, withComparisonMap]);

    return <div ref={mapRef} id="map-compare" style={{ height: "85vh", width: "100%", zIndex: 1 }}></div>;
}
