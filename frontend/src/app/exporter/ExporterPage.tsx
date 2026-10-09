"use client";
import { getRuntimeConfig } from "@/utils/runtimeConfig";

import MapExport from "@/components/Map/DynamicLeafletMapExport";
import ExporterFilterPanel from "@/components/FilterPanel/ExporterFilterPanel";
import { useFilters } from "@/context/FiltersContext";
import React, { useState, useEffect } from "react";

import ResizablePanel from "@/components/ResizablePanel";
import SpinningLoader from "@/components/SpinningLoader";

export default function ExporterPage() {
    const { filters } = useFilters();
    const [polygons, setPolygons] = useState<any[]>([]);

    const handlePolygonAdd = (polygon: any) => {
        setPolygons((prev) => [...prev, polygon]); // keep all polygons
    };

    const handlePolygonDelete = () => {
        setPolygons([]);
    };

    const [deposits, setDeposits] = useState<any[]>([]);
    const [loadingDeposits, setLoadingDeposits] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const onClickRequest = async () => {
        setError(null);

        try {
            const res = await fetch(`${getRuntimeConfig().NEXT_PUBLIC_URL_BACKEND_SERVER}/api/v1/export/save-job`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ filters, polygons }), // send your data
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            const { job_id } = await res.json();

            window.open(`${getRuntimeConfig().NEXT_PUBLIC_URL_BACKEND_SERVER}/api/v1/export/download-csv?job_id=${job_id}`);
        } catch (err) {
            setError((err as Error).message);
        }
    };

    useEffect(() => {
        async function fetchDeposits() {
            setLoadingDeposits(true);
            setError(null);
            try {
                const params = new URLSearchParams();

                if (filters.platform.length > 0) params.append("platforms", filters.platform.join(","));
                if (filters.startDate) params.append("start_date", filters.startDate);
                if (filters.endDate) params.append("end_date", filters.endDate);

                const res = await fetch(
                    `${getRuntimeConfig().NEXT_PUBLIC_URL_BACKEND_SERVER}/api/v1/deposits/filter?${params.toString()}`
                );
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();

                setDeposits(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoadingDeposits(false);
            }
        }

        fetchDeposits();
    }, [filters.platform, filters.startDate, filters.endDate]);

    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <ResizablePanel
            left_content={
                <div className="flex flex-col">
                    {/* Buttons */}
                    <div className="flex flex-row justify-around">
                        <button
                            onClick={onClickRequest}
                            className="px-4 py-2 rounded-md bg-[linear-gradient(135deg,#6BA097,#4D7C73)] text-pearl-100 font-semibold hover:bg-deepteal-500 hover:scale-105 mb-4 max-w-1/2 self-center"
                            id="exporter-button"
                        >
                            Export your data
                        </button>
                    </div>
                    <ExporterFilterPanel />
                </div>
            }
            right_content={
                loadingDeposits ? (
                    <SpinningLoader />
                ) : (
                    <MapExport
                        deposits={deposits}
                        polygons={polygons}
                        onPolygonAdd={handlePolygonAdd}
                        onPolygonDelete={handlePolygonDelete}
                    />
                )
            }
            right_title="Flying solo, you have a fair workload."
        ></ResizablePanel>
    );
}
