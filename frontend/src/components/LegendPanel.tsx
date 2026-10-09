"use client";
import { getRuntimeConfig } from "@/utils/runtimeConfig";

import { useEffect, useState } from "react";

type DepthLegendItem = { depth: number; color: string };
type HabitatLegend = Record<string, string>;
type DepthLegend = DepthLegendItem[];

type LegendGroup = { title: string; legend: DepthLegend | HabitatLegend; description: string };

// Helper to ensure color alpha is 0..1 (accepts "rgba(r,g,b,a)" where a might be 0..255)
function normalizeRgba(rgba: string) {
    // if alpha appears as 255 use 1
    const match = rgba.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/);
    if (!match) return rgba;
    const r = +match[1],
        g = +match[2],
        b = +match[3];
    let a = match[4] === undefined ? 1 : +match[4];
    if (a > 1) a = a / 255; // convert 0-255 alpha to 0-1 if needed
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// Build a correct CSS gradient from depthLegend (array of {depth, color})
function buildDepthGradient(depthLegend: { depth: number; color: string }[]) {
    if (!depthLegend?.length) return "";

    // Clone and sort by depth ascending (left -> right)
    const sorted = depthLegend.slice().sort((a, b) => a.depth - b.depth);

    const stops = sorted.map((s, i) => {
        const color = normalizeRgba(s.color);
        const pct = (i / (sorted.length - 2)) * 100; // equal spacing
        return `${color} ${pct.toFixed(2)}%`;
    });

    return `linear-gradient(to right, ${stops.join(", ")})`;
}

export default function LegendPanel() {
    const [loading, setLoading] = useState(true);
    const [legends, setLegends] = useState<LegendGroup[]>([]);

    // Retrieve all the layers from the cog server.
    useEffect(() => {
        async function fetchLegend() {
            try {
                const res = await fetch(`${getRuntimeConfig().NEXT_PUBLIC_URL_COG_SERVER}/get-all-legend`);
                if (!res.ok) throw new Error("Failed to fetch legend");
                const legends: LegendGroup[] = await res.json();
                setLegends(legends);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchLegend();
    }, []);

    if (loading) return <p>Loading Legends...</p>;

    return (
        <div>
            {legends.map((group, idx) => (
                <div key={idx} className="p-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">{group.title}</h3>
                    {group.description && <p className="text-xs text-gray-500 mb-2">{group.description}</p>}

                    {"length" in group.legend ? (
                        // Depth legend (continuous)
                        <div>
                            <div
                                className="h-4 w-full rounded-lg border border-gray-300"
                                style={{ background: buildDepthGradient(group.legend as DepthLegend) }}
                            ></div>
                            <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                                {(group.legend as DepthLegend)
                                    .slice()
                                    .sort((a, b) => a.depth - b.depth)
                                    .map((l, i) => (
                                        <span key={i}>{l.depth}</span>
                                    ))}
                            </div>
                        </div>
                    ) : (
                        // Habitat legend (categorical)
                        <ul className="space-y-1 mt-1">
                            {Object.entries(group.legend as HabitatLegend).map(([label, color]) => (
                                <li key={label} className="flex items-center gap-2 text-sm text-gray-700">
                                    <span
                                        className="inline-block w-4 h-4 rounded-sm border border-gray-300"
                                        style={{ backgroundColor: color }}
                                    ></span>
                                    {label}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    );
}
