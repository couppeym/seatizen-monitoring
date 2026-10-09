"use client";
import { getRuntimeConfig } from "@/utils/runtimeConfig";

import { useEffect, useMemo, useState } from "react";

import { Item } from "@/lib/definition";
import HelperTooltip from "../HelperTooltip";
import CustomMultiSelect from "../CustomMultiSelect";

type MlClass = {
    id: number;
    name: string;
};
export interface ClassSelectorProps {
    modelId: number | null;
    selected_class_ids: number[];
    onSelectClasses: (classIds: number[]) => void;
}

export default function ClassSelector({ modelId, selected_class_ids, onSelectClasses }: ClassSelectorProps) {
    const [classes, setClasses] = useState<MlClass[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch classes when modelId changes
    useEffect(() => {
        if (!modelId) return;

        async function fetchClasses() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(
                    `${getRuntimeConfig().NEXT_PUBLIC_URL_BACKEND_SERVER}/api/v1/ml_class/model/${modelId}`
                );
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data: MlClass[] = await res.json();

                const allClassesOption: MlClass = { id: 0, name: "All classes" };
                setClasses([allClassesOption, ...data]);

                // By default, notify parent with "All classes"
                onSelectClasses([0]);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        }

        fetchClasses();
    }, [modelId]);

    const selectedItems = useMemo(() => {
        return classes.filter((field) => selected_class_ids.includes(field.id));
    }, [classes, selected_class_ids]);

    if (!modelId) return <p>Please select a model first.</p>;
    if (loading) return <p className="text-gray-500">Loading classes...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    const handleSelectItems = (selectedFields: Item[]) => {
        const selectedIds = selectedFields.map((f) => Number(f.id));

        if (selectedIds.includes(0) && selectedIds.length > 1) {
            // Remove "All classes" if other classes are selected
            const filtered = selectedIds.filter((id) => id !== 0);
            onSelectClasses(filtered);
        } else {
            onSelectClasses(selectedIds);
        }
    };

    return (
        <div className="relative w-full p-4">
            <HelperTooltip text="Multilabel class of the choosen model. More information on the model's huggingface page." />
            <label className="block font-medium text-sm md:text-md text-slate-700 mb-2">Multilabel Classes</label>

            <CustomMultiSelect
                placeholder="Select a multilabel class"
                data={classes.map((d) => ({ id: d.id.toString(), name: d.name }))}
                selected_items={selectedItems.map((d) => ({ id: d.id.toString(), name: d.name }))}
                set_selected_items={handleSelectItems}
            />
        </div>
    );
}
