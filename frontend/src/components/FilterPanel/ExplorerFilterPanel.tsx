import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { COGServerResponse } from "@/lib/definition";
import { useExplorerFilters } from "@/context/ExplorerFilterContext";
import FancyMultiSelect from "../Controls/FancyMultiSelect";
import AccordionComponent from "../Accordion";
import { SquareStack } from "lucide-react";
import { getRuntimeConfig } from "@/utils/runtimeConfig";

export default function ExplorerFilterPanel() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const { filters, setFilters } = useExplorerFilters();
    const [layers, setLayers] = useState<COGServerResponse[]>([]);
    const [loading, setLoading] = useState(true);

    // Retrieve all the layers from the cog server.
    useEffect(() => {
        async function fetchLayers() {
            try {
                const res = await fetch(`${getRuntimeConfig().NEXT_PUBLIC_URL_COG_SERVER}/layers`);
                if (!res.ok) throw new Error("Failed to fetch layers");
                const layers: COGServerResponse[] = await res.json();
                setLayers(layers);

                const leftIds = searchParams.get("left")?.split(",") || [];
                const rightIds = searchParams.get("right")?.split(",") || [];

                // Filter and sort to keep the url order.
                const selected_left_layers = layers
                    .filter((l) => leftIds.includes(l.id))
                    .sort((a, b) => leftIds.indexOf(a.id) - leftIds.indexOf(b.id));

                const selected_right_layers = layers
                    .filter((l) => rightIds.includes(l.id))
                    .sort((a, b) => rightIds.indexOf(a.id) - rightIds.indexOf(b.id));

                setFilters((f) => ({ ...f, selected_left_layers, selected_right_layers }));
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchLayers();
    }, []);

    // Update the url based on the selected layers for each side.
    useEffect(() => {
        updateURL(filters.selected_left_layers, filters.selected_right_layers);
    }, [filters.selected_left_layers, filters.selected_right_layers]);

    const updateURL = (left: COGServerResponse[], right: COGServerResponse[]) => {
        const params = new URLSearchParams(searchParams.toString());
        if (left.length !== 0) params.set("left", left.map((l) => l.id).join(","));
        else params.delete("left");

        if (right.length !== 0) params.set("right", right.map((l) => l.id).join(","));
        else params.delete("right");

        router.push(`?${params.toString()}`, { scroll: false });
    };

    if (loading) return <p>Loading layers...</p>;
    if (!layers.length) return <p>No layers available</p>;

    return (
        <div className="z-2" id="layers-selectors">
            <AccordionComponent
                icon={SquareStack}
                defaultOpen
                title="Map Layers"
                content={
                    <>
                        <FancyMultiSelect
                            opt_layers={layers}
                            setSelectedLayers={(selected_left_layers) =>
                                setFilters((f) => ({ ...f, selected_left_layers }))
                            }
                            selected_layers={filters.selected_left_layers}
                            title="Left panel"
                        />
                        <FancyMultiSelect
                            opt_layers={layers}
                            setSelectedLayers={(selected_right_layers) =>
                                setFilters((f) => ({ ...f, selected_right_layers }))
                            }
                            selected_layers={filters.selected_right_layers}
                            title="Right panel"
                        />
                    </>
                }
            />
        </div>
    );
}
