"use client";
import { getRuntimeConfig } from "@/utils/runtimeConfig";

import { useEffect, useMemo, useState } from "react";

import { DepositSearchTerms, Item } from "@/lib/definition";
import HelperTooltip from "../HelperTooltip";
import CustomMultiSelect from "../CustomMultiSelect";

export interface PlatformSelectorProps {
    values: string[];
    setSelectedValues: (value: string[]) => void;
}

export default function PlatformSelector({ values, setSelectedValues }: PlatformSelectorProps) {
    const [platforms, setPlatforms] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch platforms from backend
    useEffect(() => {
        async function fetchPlatforms() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`${getRuntimeConfig().NEXT_PUBLIC_URL_BACKEND_SERVER}/api/v1/deposits/search`);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data: DepositSearchTerms = await res.json();

                const plats: string[] = data.platforms ?? [];

                setPlatforms(plats.map((d) => ({ id: d, name: d })));
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        }

        fetchPlatforms();
    }, []);

    const selectedItems = useMemo(() => {
        return platforms.filter((plat) => values.includes(plat.name));
    }, [platforms, values]);

    if (loading) return <p className="text-gray-500">Loading platforms...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;
    if (platforms.length === 0) return "No platforms found";

    return (
        <div className="relative w-full p-4">
            <label className="text-sm md:text-md text-slate-700 block mb-2 font-semibold">Acquisition platform</label>
            <HelperTooltip text="This component allows the user to filter the desired acquisition platforms. An acquisition platform can correspond to a drone, a paddle, ..." />

            <CustomMultiSelect
                placeholder="Select a platform"
                data={platforms}
                selected_items={selectedItems}
                set_selected_items={(selectedFields: Item[]) => setSelectedValues(selectedFields.map((vv) => vv.name))}
            />
        </div>
    );
}
