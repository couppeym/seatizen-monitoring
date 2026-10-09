"use client";

import { useEffect, useMemo, useState } from "react";
import { getRuntimeConfig } from "@/utils/runtimeConfig";

import { Item } from "@/lib/definition";
import HelperTooltip from "../HelperTooltip";
import CustomMultiSelect from "../CustomMultiSelect";

export interface FrameFieldSelectorProps {
    values: string[];
    setSelectedValues: (value: string[]) => void;
}

export default function FrameFieldSelector({ values, setSelectedValues }: FrameFieldSelectorProps) {
    const [fields, setFields] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch fields from backend
    useEffect(() => {
        async function fetchFramesFields() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`${getRuntimeConfig().NEXT_PUBLIC_URL_BACKEND_SERVER}/api/v1/frame/fields`);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data: string[] = await res.json();

                setFields(data.map((d) => ({ id: d, name: d })));
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        }

        fetchFramesFields();
    }, []);

    const selectedItems = useMemo(() => {
        return fields.filter((field) => values.includes(field.name));
    }, [fields, values]);

    if (loading) return <p className="text-gray-500">Loading frames fields...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;
    if (fields.length === 0) return "No frames fields found";

    return (
        <div className="relative w-full p-4">
            <HelperTooltip text="The chosen metadata will be added in the csv export. They correspond to the exif data of the images." />
            <label className="text-sm md:text-md block font-medium text-slate-700 mb-2">Frames Metadata</label>
            <CustomMultiSelect
                placeholder="Select a frame field"
                data={fields}
                selected_items={selectedItems}
                set_selected_items={(selectedFields: Item[]) => setSelectedValues(selectedFields.map((vv) => vv.name))}
            />
        </div>
    );
}
