"use client";
import { getRuntimeConfig } from "@/utils/runtimeConfig";

import { useEffect, useState } from "react";
import { Range } from "react-range";
import HelperTooltip from "../HelperTooltip";
import { DepositSearchTerms } from "@/lib/definition";

interface TimelineSliderProps {
    startDate: string;
    endDate: string;
    onChange: (start: string, end: string) => void;
}

export default function TimelineSlider({ startDate, endDate, onChange }: TimelineSliderProps) {
    const [minDate, setMinDate] = useState<Date | null>(null);
    const [maxDate, setMaxDate] = useState<Date | null>(null);
    const [values, setValues] = useState<number[]>([0, 0]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchTimeline() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`${getRuntimeConfig().NEXT_PUBLIC_URL_BACKEND_SERVER}/api/v1/deposits/search`);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data: DepositSearchTerms = await res.json();

                const min = new Date(data.timeline.min);
                const max = new Date(data.timeline.max);
                const selected_min = new Date(startDate);
                const selected_max = new Date(endDate);
                setMinDate(min);
                setMaxDate(max);
                setValues([selected_min.getTime(), selected_max.getTime()]);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        }

        fetchTimeline();
    }, [startDate, endDate]);

    if (loading) return <p className="text-gray-500">Loading timeline...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;
    if (!minDate || !maxDate) {
        return <div className="p-4 text-gray-500">Loading timeline...</div>;
    }

    const formatDate = (ts: number) => new Date(ts).toISOString().split("T")[0];

    return (
        <div className="relative w-full p-4">
            <HelperTooltip text="This component allows the user to select sessions within the desired time range." />

            <label className="text-sm md:text-md block font-medium text-slate-700 mb-2">Acquisition Timeline</label>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-xs md:text-sm font-medium text-slate-700">From: {formatDate(values[0])}</span>
                    <span className="text-xs md:text-sm font-medium text-slate-700">To: {formatDate(values[1])}</span>
                </div>
                <Range
                    key={`${minDate?.getTime()}-${maxDate?.getTime()}`} // This ensures React doesn’t try to reuse the old virtual DOM tree that was rendered when minDate was null.
                    step={24 * 60 * 60 * 1000} // 1 day in ms
                    min={minDate.getTime()}
                    max={maxDate.getTime()}
                    values={values}
                    onChange={(vals) => {
                        // just update locally
                        setValues(vals);
                    }}
                    onFinalChange={(vals) => {
                        // only notify parent when drag ends
                        onChange(formatDate(vals[0]), formatDate(vals[1]));
                    }}
                    renderTrack={({ props, children }) => (
                        <div {...props} className="relative w-full h-2 rounded-full bg-gray-200">
                            <div
                                ref={props.ref}
                                className="absolute h-2 rounded-full bg-deepteal-300"
                                style={{
                                    left: `${
                                        ((values[0] - minDate.getTime()) / (maxDate.getTime() - minDate.getTime())) *
                                        100
                                    }%`,
                                    width: `${
                                        ((values[1] - values[0]) / (maxDate.getTime() - minDate.getTime())) * 100
                                    }%`,
                                }}
                            />
                            {children}
                        </div>
                    )}
                    renderThumb={({ props }) => (
                        <div
                            {...props}
                            key={props.key}
                            className="w-5 h-5 bg-white border-2 border-deepteal-300 rounded-full shadow-md cursor-pointer"
                        ></div>
                    )}
                />
            </div>
        </div>
    );
}
