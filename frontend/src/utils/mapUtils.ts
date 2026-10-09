import { COGServerResponse, DEFAULT_CENTER, DEFAULT_ZOOM } from "@/lib/definition";
import L from "leaflet";
import { RefObject } from "react";
import { getRuntimeConfig } from "@/utils/runtimeConfig";


export function bindMapMoveToUrl(map: L.Map) {
    const handler = () => {
        const center = map.getCenter();
        const zoom = map.getZoom();
        const newParams = new URLSearchParams(window.location.search);
        newParams.set("lat", center.lat.toFixed(5));
        newParams.set("lng", center.lng.toFixed(5));
        newParams.set("zoom", zoom.toString());
        window.history.replaceState({}, "", `?${newParams.toString()}`);
    };

    map.on("moveend", handler);

    return () => {
        map.off("moveend", handler); // Remove listener
    };
}

// On map click, get the depth or the predictions value.
export function bindMapRequestPredOrDepthAtClick(
    map: L.Map,
    splitRef: RefObject<any>,
    urlsRef: RefObject<{
        left: COGServerResponse[];
        right: COGServerResponse[];
        with_asv: boolean;
    }>
) {
    const handler = async (event: any) => {
        const separator = Number(splitRef.current._divider.style.left.replace("px", ""));
        if (Math.abs(event.containerPoint.x - separator) <= 1) return; // Click trigger by sliding the split object.
        let request_years = "";

        const layers_on_choosen_side =
            event.containerPoint.x < separator ? urlsRef.current.left : urlsRef.current.right;
        layers_on_choosen_side.forEach((layer) => {
            request_years = "&layers_id=" + layer.id + request_years;
        });

        if (request_years === "") return;

        const { lat, lng } = event.latlng;

        const response = await fetch(
            `${getRuntimeConfig().NEXT_PUBLIC_URL_COG_SERVER}/depthOrprediction?lon=${lng}&lat=${lat}${request_years}`
        );
        const data = await response.json();

        if (data.value === null) return;

        L.popup()
            .setLatLng([lat, lng, lat])
            .setContent(data.type === "bathy" ? `Depth: ${data.value.toFixed(2)} m` : `Habitat Class: ${data.value}`)
            .openOn(map);
    };

    map.on("click", handler);

    return () => {
        map.off("click", handler); // Remove listener
    };
}

// Get initial map view from URL or defaults
export function getInitialView(): { lat: number; lng: number; zoom: number } {
    const params = new URLSearchParams(window.location.search);
    const lat = parseFloat(params.get("lat") || `${DEFAULT_CENTER[0]}`);
    const lng = parseFloat(params.get("lng") || `${DEFAULT_CENTER[1]}`);
    const zoom = parseInt(params.get("zoom") || `${DEFAULT_ZOOM}`, 10);
    return { lat, lng, zoom };
}
