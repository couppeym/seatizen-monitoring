"use client";
import { getRuntimeConfig } from "@/utils/runtimeConfig";

import { useEffect, useState } from "react";

import ToggleButton from "@/components/Controls/ToggleButton";
import MapCompare from "@/components/Map/DynamicLeafletMapCompare";
import { COGServerResponse, Deposit } from "@/lib/definition";
import ASVExplorerFilterPanel from "@/components/FilterPanel/ASVExplorerFilterPanel";
import { useASVExplorerFilters } from "@/context/ASVExplorerFilterContext";
import ResizablePanel from "@/components/ResizablePanel";

export default function ASVExplorerPage() {
    const { filters } = useASVExplorerFilters();
    const [layersMap, setLayersMap] = useState<Map<string, COGServerResponse>>(new Map());

    const [selectedLayersLeft, setSelectedLayersLeft] = useState<COGServerResponse[]>([]);
    const [selectedLayersRight, setSelectedLayersRight] = useState<COGServerResponse[]>([]);

    const [selectedDepositsLeft, setSelectedDepositsLeft] = useState<Deposit[]>([]);
    const [selectedDepositsRight, setSelectedDepositsRight] = useState<Deposit[]>([]);

    const [loading, setLoading] = useState(true);
    const [showMarkers, setShowMarkers] = useState(true);

    async function get_layers(year: string, specie: string): Promise<COGServerResponse[]> {
        const params = new URLSearchParams();

        params.append("year", year);
        params.append("specie", specie);

        const res = await fetch(`${getRuntimeConfig().NEXT_PUBLIC_URL_COG_SERVER}/get-layer?${params.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}, Cannot retrieve information for left layer`);
        const layer: COGServerResponse = await res.json();

        const background_map = layersMap.get(`ortho_${year}`);

        if (background_map) {
            return [background_map, layer];
        }
        return [layer];
    }

    async function get_deposits(year: string): Promise<Deposit[]> {
        const params = new URLSearchParams();
        params.append("year", year);
        const res = await fetch(
            `${getRuntimeConfig().NEXT_PUBLIC_URL_BACKEND_SERVER}/api/v1/deposits/footprint?${params.toString()}`
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}, Cannot retrieve information for left layer`);
        const deposits: Deposit[] = await res.json();
        return deposits;
    }

    useEffect(() => {
        async function fetchLayers() {
            try {
                const res = await fetch(`${getRuntimeConfig().NEXT_PUBLIC_URL_COG_SERVER}/layers`);
                if (!res.ok) throw new Error("Failed to fetch layers");
                const layers: COGServerResponse[] = await res.json();
                // Convert to Map for fast access
                const map = new Map<string, COGServerResponse>();
                layers.forEach((layer) => {
                    map.set(layer.id, layer);
                });

                setLayersMap(map);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchLayers();
    }, []);

    // Retrieve all the layers from the cog server.
    useEffect(() => {
        async function fetchFilters() {
            try {
                if (filters.left_specie) {
                    // ! Called setDeposit before setLayer. Elif deposits will be show on map with a delay.
                    setSelectedDepositsLeft(await get_deposits(filters.left_year.toString()));
                    setSelectedLayersLeft(await get_layers(filters.left_year.toString(), filters.left_specie.name));
                }

                if (filters.right_specie) {
                    setSelectedDepositsRight(await get_deposits(filters.right_year.toString()));
                    setSelectedLayersRight(await get_layers(filters.right_year.toString(), filters.right_specie.name));
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchFilters();
    }, [filters.left_specie, filters.right_specie, filters.left_year, filters.right_year]);

    if (loading) return <p>Loading layers...</p>;

    // The div is in reverse because the LayerDropDown need to be init before the map.
    return (
        <ResizablePanel
            left_content={
                <div>
                    <ToggleButton
                        label="GCRMN & eDNA Marker"
                        defaultState={true}
                        onToggle={(state) => setShowMarkers(state)}
                        id="markers-explorer-asv"
                    />

                    <ASVExplorerFilterPanel />
                </div>
            }
            right_content={
                <MapCompare
                    leftUrls={selectedLayersLeft}
                    rightUrls={selectedLayersRight}
                    withASV={false}
                    withMarker={showMarkers}
                    withComparisonMap={false}
                    leftDeposits={selectedDepositsLeft}
                    rightDeposits={selectedDepositsRight}
                />
            }
            right_title="Compare ASV predictions by taxon, substrate and by date."
        ></ResizablePanel>
    );
}
