"use client";

import { useEffect, useState } from "react";
import HelperTooltip from "../HelperTooltip";
import CustomSelect from "../CustomSelect";
import { DEFAULT_MODEL_ID, Item } from "@/lib/definition";
import { getRuntimeConfig } from "@/utils/runtimeConfig";

type MlModel = {
    id: number;
    name: string;
};

interface ModelSelectorProps {
    onSelectModel: (modelId: number) => void;
}

export default function ModelSelector({ onSelectModel }: ModelSelectorProps) {
    const [models, setModels] = useState<MlModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedModel, setSelectedModel] = useState<number>(DEFAULT_MODEL_ID);

    useEffect(() => {
        async function fetchModels() {
            try {
                const res = await fetch(`${getRuntimeConfig().NEXT_PUBLIC_URL_BACKEND_SERVER}/api/v1/ml_model/`);
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data: MlModel[] = await res.json();
                setModels(data);

                if (data.length > 0) {
                    setSelectedModel(data[0].id);
                    onSelectModel(data[0].id); // ✅ Notify parent
                }
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        }

        fetchModels();
    }, []);

    const setSelectedItem = (e: Item) => {
        const newId = Number(e.id);
        setSelectedModel(newId);
        onSelectModel(newId); // ✅ Notify parent on change
    };

    const selectedItem: Item = models
        .map((ml) => ({ id: String(ml.id), name: ml.name }))
        .find((ml) => Number(ml.id) === selectedModel) ?? { id: "0", name: "Not found" };

    if (loading) return <p className="text-gray-500">Loading models...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <div className="relative w-full p-4">
            <label className="block font-medium text-sm md:text-md text-slate-700 mb-2">Multilabel Model</label>
            <HelperTooltip text="Multilabel model for benthic habitat and coral morphotype detection. They can be found on Hugginface." />

            <CustomSelect
                placeholder="Choose a multilabel model..."
                data={models.map((ml) => {
                    return {
                        id: String(ml.id),
                        name: ml.name,
                    };
                })}
                selected_item={selectedItem}
                set_selected_item={setSelectedItem}
            />
        </div>
    );
}
