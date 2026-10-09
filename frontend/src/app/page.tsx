"use client";
import { getRuntimeConfig } from "@/utils/runtimeConfig";

import React, { useState, useEffect } from "react";
import {
    Database,
    Waves,
    ExternalLink,
    Microscope,
    ChevronLeft,
    ChevronRight,
    Cpu,
    Download,
    Eye,
    Map,
    Zap,
    Archive,
    Drone,
    Satellite,
    MessageCircleQuestionMark,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { EXPLORER_ADRESS, HeavyStats, LightStats } from "@/lib/definition";
import HeavyStatsSection from "@/components/StatsHomepage/HeavyChartContainer";

const DEFAULT_LIGHT_STATS: LightStats = {
    nb_deposits: 0,
    nb_frames: 0,
};

const DEFAULT_HEAVY_STATS: HeavyStats = {
    ...DEFAULT_LIGHT_STATS,
    nb_frames_q1_asv: 0,
    deposit_by_platform: [],
    frames_by_platform: [],
};

export default function Page() {
    // Logo carousel state
    const [currentLogoSlide, setCurrentLogoSlide] = useState(0);
    const [lightStats, setLightStats] = useState<LightStats>(DEFAULT_LIGHT_STATS);
    const [heavyStats, setHeavyStats] = useState<HeavyStats>(DEFAULT_HEAVY_STATS);

    const [, setError] = useState<string | null>(null);

    // Partner logos - replace with actual logos
    const partnerLogos = [
        { name: "IFREMER", logo: "/partners/ifremer.jpg" },
        { name: "COOOL", logo: "/partners/coool.svg" },
        { name: "IRD", logo: "/partners/ird.jpg" },
        { name: "LIRMM", logo: "/partners/lirmm.jpg" },
        { name: "CNRS", logo: "/partners/cnrs.png" },
        { name: "INRIA", logo: "/partners/inria.png" },
        { name: "IDOCEAN", logo: "/partners/idocean.jpg" },
        { name: "PPR", logo: "/partners/ppr.png" },
        { name: "Région Réunion", logo: "/partners/region-reunion-logo.png" },
        { name: "Gouvernement français", logo: "/partners/gouvernement.png" },
        { name: "OFB", logo: "/partners/ofb.jpg" },
        { name: "Parc naturel marin", logo: "/partners/parc_naturel_marin.jpeg" },
        { name: "Union Européenne", logo: "/partners/ue.png" },
        { name: "Institut Halieutique et des sciences marines", logo: "/partners/ihsm.png" },
        { name: "Exploration de Monaco", logo: "/partners/monaco.png" },
        { name: "Seychelles Islands Foundation", logo: "/partners/sif.png" },
    ];

    useEffect(() => {
        async function fetchLightStats() {
            try {
                const res = await fetch(`${getRuntimeConfig().NEXT_PUBLIC_URL_BACKEND_SERVER}/api/v1/stats/light`);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data: LightStats = await res.json();

                setLightStats(data);
            } catch (err) {
                setError((err as Error).message);
            }
        }
        async function fetchHeavyStats() {
            try {
                const res = await fetch(`${getRuntimeConfig().NEXT_PUBLIC_URL_BACKEND_SERVER}/api/v1/stats/heavy`);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data: HeavyStats = await res.json();

                setHeavyStats(data);
            } catch (err) {
                setError((err as Error).message);
            }
        }

        fetchLightStats();
        fetchHeavyStats();
    }, []);

    // Auto-advance carousel
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentLogoSlide((prev) => (prev + 1) % Math.ceil(partnerLogos.length / 4));
        }, 6000);
        return () => clearInterval(timer);
    }, [partnerLogos.length]);

    const nextSlide = () => {
        setCurrentLogoSlide((prev) => (prev + 1) % Math.ceil(partnerLogos.length / 4));
    };

    const prevSlide = () => {
        setCurrentLogoSlide(
            (prev) => (prev - 1 + Math.ceil(partnerLogos.length / 4)) % Math.ceil(partnerLogos.length / 4)
        );
    };

    return (
        <div className="min-h-screen ">
            {/* Hero Section */}
            <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-deepteal-200 to-ocean-800 text-cream-50">
                <div className="relative text-center px-6 max-w-6xl mx-auto">
                    <div className="mb-8">
                        <div className="mb-6 mt-4">
                            <Cpu className="w-20 h-20 mx-auto mb-4 text-sage-300" />
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-cream-100 bg-clip-text mb-6 leading-tight">
                            Seatizen Monitoring
                        </h1>
                        <p className="text-xl md:text-2xl text-beige-200 mb-4 max-w-4xl mx-auto leading-relaxed">
                            Open-access platform to explore, visualize, and download georeferenced marine data collected
                            by autonomous surface vehicles, drones, and more ...
                        </p>
                        <p className="text-lg text-pearl-100 max-w-3xl mx-auto">
                            Seatizen Monitoring lets users explore and interact with the Seatizen Atlas Database.
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-ocean-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                            <div className="text-3xl font-bold text-ocean-600 mb-2">{lightStats.nb_deposits}</div>
                            <div className="text-ocean-700">Sessions</div>
                        </div>
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-ocean-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                            <div className="text-3xl font-bold text-ocean-600 mb-2">
                                {lightStats.nb_frames.toLocaleString()}
                            </div>{" "}
                            <div className="text-ocean-700">Images</div>
                        </div>
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-ocean-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                            <div className="text-3xl font-bold text-ocean-600 mb-2">14TB</div>
                            <div className="text-ocean-700">Data</div>
                        </div>
                    </div>

                    <p className="text-lg text-cream-100 mb-8">
                        From autonomous surface vehicles to AI-powered habitat mapping, discover lagoon ecosystems like
                        never before.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                        <Link
                            href="https://doi.org/10.5281/zenodo.11125847"
                            target="_blank"
                            className="bg-white/80 backdrop-blur-sm text-deepteal-700 px-8 py-4 rounded-full text-lg font-semibold border border-deepteal-300 hover:bg-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                            <Download className="w-5 h-5" />
                            Explore Dataset
                        </Link>
                        <Link
                            href={EXPLORER_ADRESS}
                            className="bg-gradient-to-r from-ocean-500 to-ocean-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-ocean-600 hover:to-ocean-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                            <Eye className="w-5 h-5" />
                            Explore Data Now
                        </Link>
                        <Link
                            href="/docs"
                            className="bg-white/80 backdrop-blur-sm text-deepteal-700 px-8 py-4 rounded-full text-lg font-semibold border border-deepteal-300 hover:bg-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                            <MessageCircleQuestionMark className="w-5 h-5" />
                            Tutorials
                        </Link>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-6 py-16">
                {/* What is a Session Section */}
                <section className="py-20 bg-gradient-to-r from-pearl-100 to-cream-100" id="sessions">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-4xl font-bold text-deepteal-600 mb-6">What is a Session?</h2>
                                <p className="text-lg text-deepteal-700 mb-6 leading-relaxed">
                                    A <strong>session</strong> corresponds to a single data collection mission. We start
                                    the platform (ASV, drone, diver), upload a predefined survey plan, let it execute
                                    the mission, and stop once it returns to the starting point.
                                </p>
                                <p className="text-lg text-deepteal-600 leading-relaxed">
                                    All sessions are stored in a <strong>unified directory structure</strong>,
                                    regardless of how the data was collected, and archived on{" "}
                                    <Link
                                        href="https://doi.org/10.5281/zenodo.11125847"
                                        target="_blank"
                                        className="font-bold animate-pulse"
                                    >
                                        Zenodo
                                    </Link>{" "}
                                    for open access.
                                </p>
                                <p className="text-lg text-sage-600 mt-6 leading-relaxed">
                                    This allows for <strong>consistent, repeatable acquisitions</strong> across time and
                                    space, which is essential for long-term ecological monitoring.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-gradient-to-br from-ocean-100 to-sage-100 rounded-2xl p-6 border border-ocean-200 shadow-lg">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center">
                                            <div className="w-14 h-14 bg-cream-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <Image alt="plancha" src={"plancha.svg"} width={40} height={40} />
                                            </div>
                                            <div className="text-sm text-deepteal-700">ASV Platform</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="w-14 h-14 bg-sage-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <Drone className="w-7 h-7 text-white" />
                                            </div>
                                            <div className="text-sm text-deepteal-700">Drone Surveys</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="w-14 h-14 bg-deepteal-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <Waves className="w-7 h-7 text-white" />
                                            </div>
                                            <div className="text-sm text-deepteal-700">SCUBA Divers</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="w-14 h-14 bg-cream-700 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <Archive className="w-7 h-7 text-white" />
                                            </div>
                                            <div className="text-sm text-deepteal-700">Zenodo Archive</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Data Available Section */}
                <section className="py-20" id="data">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-deepteal-600 mb-6">Which Data is Available?</h2>
                            <p className="text-xl text-sage-600 max-w-3xl mx-auto">
                                Seatizen Atlas provides both raw and processed data
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8 mb-12">
                            {/* Raw Data */}
                            <div className="bg-gradient-to-br from-ocean-50 to-ocean-100 rounded-3xl p-8 border border-ocean-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 bg-ocean-500 rounded-xl flex items-center justify-center mr-4">
                                        <Database className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-ocean-700">Raw Data</h3>
                                </div>
                                <p className="text-ocean-600 mb-4">Direct output from acquisition platforms.</p>
                                <ul className="space-y-2 text-ocean-600 mb-4">
                                    <li>
                                        • <strong>Videos</strong>
                                    </li>
                                    <li>
                                        • <strong>GPS Device and Base</strong>
                                    </li>
                                    <li>
                                        • <strong>Autopilot file</strong>
                                    </li>
                                </ul>
                                <div className="text-sm text-ocean-500 bg-ocean-50 p-4 rounded-lg">
                                    <p className="font-medium mb-2">Privacy Protection:</p>
                                    <p>
                                        Some ASV and citizen science raw data are not public to protect privacy — for
                                        example, beachgoers may appear in GoPro videos.
                                    </p>
                                </div>
                            </div>

                            {/* Processed Data */}
                            <div className="bg-gradient-to-br from-deepteal-50 to-deepteal-100 rounded-3xl p-8 border border-deepteal-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 bg-deepteal-500 rounded-xl flex items-center justify-center mr-4">
                                        <Zap className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-deepteal-700">Processed Data</h3>
                                </div>
                                <ul className="space-y-2 text-deepteal-600 mb-4">
                                    <li>
                                        • <strong>Photogrammetry</strong>
                                    </li>
                                    <li>
                                        • <strong>Georeferenced images</strong> (centimeter precision using PPK)
                                    </li>
                                    <li>
                                        • <strong>Bathymetric rasters</strong>
                                    </li>
                                    <li>
                                        • <strong>Metadata CSV files</strong>
                                    </li>
                                    <li>
                                        • <strong>AI prediction rasters</strong> (habitat classification, coral
                                        detection)
                                    </li>
                                </ul>
                                <div className="text-sm text-deepteal-500 bg-deepteal-50 p-4 rounded-lg">
                                    <p>
                                        Processed data are archived on Zenodo, each assigned a unique DOI. Their
                                        metadata are compiled into a <strong>GeoPackage</strong> (SQLite with spatial
                                        support) and made available on Zenodo as the <strong>Seatizen Atlas.</strong>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-lg text-deepteal-600 bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-deepteal-200 shadow-lg max-w-2xl mx-auto">
                                For more details, see our reference paper:{" "}
                                <Link
                                    href="https://doi.org/10.1038/s41597-024-04267-z"
                                    target="_blank"
                                    className="font-bold animate-pulse"
                                >
                                    Seatizen Atlas Nature
                                </Link>
                            </p>
                        </div>
                    </div>
                </section>

                <section className="py-20" id="videos">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-deepteal-600 mb-6">
                                A window to the underwater world
                            </h2>
                        </div>

                        <div className="flex flex-row justify-between">
                            <iframe
                                width="560"
                                height="315"
                                src="https://www.youtube.com/embed/kM8BlmeyVmg?si=VW3dKqpcw0jfcJNG"
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            ></iframe>
                            <iframe
                                width="560"
                                height="315"
                                src="https://www.youtube.com/embed/3PjCr2l7P6I?si=90ATnJ72XMNPecHh"
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </section>

                {/* Explore Tools Section */}
                <section className="py-20 bg-gradient-to-r from-deepteal-50 to-ocean-50" id="explore">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-deepteal-600 mb-6">Explore the Data</h2>
                            <p className="text-xl text-deepteal-600 max-w-4xl mx-auto">
                                This makes it easy to understand <strong>where</strong>, <strong>when</strong>, and{" "}
                                <strong>what</strong> has been observed : from a single dive to a large-scale lagoon
                                mapping campaign.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
                            {/* Database Viewer */}
                            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-deepteal-100">
                                <div className="flex items-start ">
                                    <div className="w-14 h-14 bg-gradient-to-br from-deepteal-500 to-deepteal-600 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                                        <Database className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-semibold text-deepteal-700 mb-3">Exporter</h3>
                                        <p className="text-deepteal-600">
                                            Browse all sessions, filter by acquisition platform, date, or geographic
                                            extent. Export metadata, predictions, and model classes for further
                                            analysis.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Map Explorer */}
                            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-ocean-100">
                                <div className="flex items-start ">
                                    <div className="w-14 h-14 bg-gradient-to-br from-ocean-500 to-ocean-600 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                                        <Map className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-semibold text-ocean-700 mb-3">Explorer</h3>
                                        <p className="text-ocean-600">
                                            Visualize ASV and drone orthophotos, overlay prediction rasters, click to
                                            see predicted habitat labels or bathymetry values, and compare two areas
                                            side-by-side.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* ASV Explorer */}
                            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-sage-100">
                                <div className="flex items-start ">
                                    <div className="w-14 h-14 bg-gradient-to-br from-sage-500 to-sage-600 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                                        <Waves className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-semibold text-sage-700 mb-3">ASV Explorer</h3>
                                        <p className="text-sage-600">View ASV predictions by label and date.</p>
                                    </div>
                                </div>
                            </div>

                            {/* GCRMN & eDNA */}
                            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-cream-300">
                                <Link href={"https://gcrmn.net/"} target="_blank">
                                    <div className="flex items-start">
                                        <div className="w-14 h-14 bg-gradient-to-br from-cream-700 to-cream-800 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                                            <Microscope className="w-7 h-7 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-semibold text-cream-800 mb-3">
                                                GCRMN & eDNA Points
                                            </h3>
                                            <p className="text-cream-700">
                                                Locate long-term monitoring sites (GCRMN) and eDNA sampling points with
                                                protocol details and results.
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* AI Section */}
                <section className="py-20" id="ai">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-deepteal-600 mb-6">Artificial Intelligence</h2>
                            <p className="text-xl text-sage-600 max-w-3xl mx-auto">
                                AI models are trained to detect coral morphotypes and benthic organisms.
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8 mb-12">
                            {/* Image Classification */}
                            <div className="bg-gradient-to-br from-ocean-50 to-ocean-100 rounded-3xl p-8 border border-ocean-200 shadow-xl">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 bg-ocean-500 rounded-xl flex items-center justify-center mr-4">
                                        <Image alt="plancha" src={"plancha.svg"} width={40} height={40} />
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="text-2xl font-bold text-ocean-700">Fine Scale</h3>
                                        <h3 className="text-xl font-medium text-ocean-700">Underwater Image</h3>
                                    </div>
                                </div>
                                <div className=" rounded-xl mb-6 flex items-center justify-center ">
                                    <Image
                                        alt="ASV prediction"
                                        src={"/homepage/asv_pred.jpg"}
                                        width={400}
                                        height={400}
                                        className="border rounded-3xl border-deepteal-200"
                                    />
                                </div>
                                <div className="space-y-3 text-ocean-600">
                                    <div className="flex">
                                        <div className="w-2 h-2 max-w-2 min-w-2 bg-ocean-500 rounded-full mr-3 mt-2"></div>
                                        <span>
                                            <strong>14,492</strong> ASV & SCUBA images manually annotated using{" "}
                                            <Link
                                                href="https://voxel51.com/"
                                                target="_blank"
                                                className="font-bold animate-pulse"
                                            >
                                                FiftyOne
                                            </Link>
                                        </span>
                                    </div>
                                    <div className="flex">
                                        <div className="w-2 h-2 max-w-2 min-w-2 bg-ocean-500 rounded-full mr-3 mt-2"></div>
                                        <span>
                                            Fine-tuned{" "}
                                            <Link
                                                href="https://arxiv.org/abs/2304.07193"
                                                target="_blank"
                                                className="font-bold animate-pulse"
                                            >
                                                DINOv2
                                            </Link>{" "}
                                            model for multilabel predictions
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Drone Data */}
                            <div className="bg-gradient-to-br from-sage-50 to-sage-100 rounded-3xl p-8 border border-sage-200 shadow-xl">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 bg-sage-500 rounded-xl flex items-center justify-center mr-4">
                                        <Drone className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="text-2xl font-bold text-sage-700">Medium Scale</h3>
                                        <h3 className="text-xl font-medium text-sage-700"> Drone Data</h3>
                                    </div>
                                </div>
                                <div className=" rounded-xl mb-6 flex items-center justify-center">
                                    <Image
                                        alt="Drone prediction"
                                        src={"/homepage/drone_pred.jpg"}
                                        width={600}
                                        height={400}
                                        className="border rounded-3xl border-deepteal-200"
                                    />
                                </div>
                                <div className="space-y-3 text-sage-600">
                                    <div className="flex">
                                        <div className="w-2 h-2 max-w-2 min-w-2 bg-sage-500 rounded-full mr-3 mt-2"></div>
                                        <span>
                                            Used ASV predictions as <em>pseudo-labels</em> for drone orthophotos
                                        </span>
                                    </div>
                                    <div className="flex">
                                        <div className="w-2 h-2 max-w-2 min-w-2 bg-sage-500 rounded-full mr-3 mt-2"></div>
                                        <span>
                                            <strong>Multilabel classification</strong>:{" "}
                                            <Link
                                                href="https://doi.org/10.1016/j.ecoinf.2025.103149"
                                                className="text-sage-700 animate-pulse"
                                            >
                                                &quot;From underwater to drone: A novel multi-scale knowledge
                                                distillation approach for coral reef monitoring&quot;
                                            </Link>
                                        </span>
                                    </div>
                                    <div className="flex">
                                        <div className="w-2 h-2 max-w-2 min-w-2 bg-sage-500 rounded-full mr-3 mt-2"></div>
                                        <span>
                                            <strong>Weakly supervised semantic segmentation</strong>:{" "}
                                            <Link
                                                href="http://dx.doi.org/10.48550/arXiv.2508.18958"
                                                className="text-sage-700 animate-pulse"
                                            >
                                                &quot;The point is the mask: scaling coral reef segmentation with weak
                                                supervision &quot;
                                            </Link>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Sattelite Approach */}
                            <div className="bg-gradient-to-br from-deepteal-50 to-deepteal-100 rounded-3xl p-8 border border-deepteal-200 shadow-xl">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 bg-deepteal-500 rounded-xl flex items-center justify-center mr-4">
                                        <Satellite className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="text-2xl font-bold text-deepteal-700">High scale</h3>
                                        <h3 className="text-xl font-medium text-deepteal-700">Satellite</h3>
                                    </div>
                                </div>
                                <div className=" rounded-xl mb-6 flex items-center justify-center">
                                    <Image
                                        alt="Ign prediction"
                                        src={"/homepage/ign_pred.jpeg"}
                                        width={600}
                                        height={400}
                                        className="border rounded-3xl border-deepteal-200"
                                    />
                                </div>
                                <div className="space-y-3 text-deepteal-600">
                                    <div className="flex">
                                        <div className="w-2 h-2 max-w-2 min-w-2 bg-deepteal-500 rounded-full mr-3 mt-2"></div>
                                        <span>
                                            Aerial orthophotos from{" "}
                                            <Link
                                                href="https://geoservices.ign.fr/bdortho"
                                                className="text-deepteal-700 animate-pulse"
                                            >
                                                IGN BDOrtho
                                            </Link>{" "}
                                            covering the entire French territory, with temporal coverage from 1950 to
                                            2022
                                        </span>
                                    </div>
                                    <div className="flex">
                                        <div className="w-2 h-2 max-w-2 min-w-2 bg-deepteal-500 rounded-full mr-3 mt-2"></div>
                                        <span>
                                            Used UAV predictions as <em>labels</em> for IGN orthophotos
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Projects Background Section */}
                <section className="py-20 bg-gradient-to-r from-pearl-100 to-beige-100" id="projects">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-deepteal-600 mb-6">Project Background</h2>
                            <p className="text-xl text-sage-600 max-w-3xl mx-auto">
                                Three innovative projects driving marine monitoring technology forward
                            </p>
                        </div>

                        <div className="space-y-12">
                            {/* SEATIZEN */}
                            <div className="grid lg:grid-cols-2 gap-8 items-center">
                                <div className="bg-white rounded-3xl p-8 shadow-xl border border-ocean-200">
                                    <div className="flex items-center mb-6">
                                        <div className="w-16 h-16 bg-gradient-to-br from-ocean-500 to-ocean-600 rounded-xl flex items-center justify-center mr-4 text-white text-xl font-bold">
                                            S
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-bold text-ocean-700">SEATIZEN</h3>
                                            <p className="text-ocean-600 font-semibold">(2020–2022)</p>
                                        </div>
                                    </div>
                                    <p className="text-ocean-600 mb-4 text-lg leading-relaxed">
                                        Development of a <strong>citizen science underwater device</strong> combining a
                                        GoPro and GPS.
                                    </p>
                                    <p className="text-ocean-600 mb-6 leading-relaxed">
                                        <strong>Goal:</strong> make lagoon monitoring accessible to the public.
                                    </p>
                                    <Link
                                        href="https://ocean-indien.ifremer.fr/Projets/Innovations-technologiques/SEATIZEN-2020-2022"
                                        className="inline-flex items-center animate-pulse text-ocean-700 font-semibold hover:text-ocean-800 transition-colors"
                                    >
                                        Learn more <ExternalLink className="w-4 h-4 ml-2" />
                                    </Link>
                                </div>
                                <div className="bg-gray-300 rounded-3xl flex items-center justify-center border border-ocean-100">
                                    <Image
                                        alt="scuba image"
                                        src={"/homepage/scuba.jpg"}
                                        width={600}
                                        height={600}
                                        className="border rounded-3xl border-ocean-100"
                                    />
                                </div>
                            </div>

                            {/* PLANCHA */}
                            <div className="grid lg:grid-cols-2 gap-8 items-center">
                                <div className="rounded-3xl flex items-center justify-center border border-sage-200 lg:order-1">
                                    <Image
                                        alt="plancha image"
                                        src={"/homepage/plancha_asv.jpg"}
                                        width={600}
                                        height={400}
                                        className="border rounded-3xl border-sage-200"
                                    />
                                </div>
                                <div className="bg-white rounded-3xl p-8 shadow-xl border border-sage-200 lg:order-2">
                                    <div className="flex items-center mb-6">
                                        <div className="w-16 h-16 bg-gradient-to-br from-sage-500 to-sage-600 rounded-xl flex items-center justify-center mr-4 text-white text-xl font-bold">
                                            P
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-bold text-sage-700">PLANCHA</h3>
                                            <p className="text-sage-600 font-semibold">(2021–2023)</p>
                                        </div>
                                    </div>
                                    <p className="text-sage-600 mb-4 text-lg leading-relaxed">
                                        Development of an <strong>instrumented autonomous surface vehicle (ASV)</strong>{" "}
                                        with:
                                    </p>
                                    <ul className="space-y-2 text-sage-600 mb-4">
                                        <li>• Differential GPS (centimeter accuracy)</li>
                                        <li>• Autopilot & twin motors</li>
                                        <li>• Single-beam echosounder</li>
                                        <li>• GoPro camera</li>
                                    </ul>
                                    <p className="text-sage-600 mb-4 leading-relaxed">
                                        This platform maps <strong>~3,000 m²</strong> in 1 hour, capturing GoPro videos
                                        down to 10 m depth and bathymetry up to 100 m depth. Drone flights are performed
                                        simultaneously for comparison.
                                    </p>
                                    <Link
                                        href="https://ocean-indien.ifremer.fr/en/Projects/Technological-innovations/PLANCHA-2021-2023"
                                        className="inline-flex items-center animate-pulse text-sage-700 font-semibold hover:text-sage-800 transition-colors"
                                    >
                                        Learn more <ExternalLink className="w-4 h-4 ml-2" />
                                    </Link>
                                </div>
                            </div>

                            {/* PPUMPIT */}
                            <div className="grid lg:grid-cols-2 gap-8 items-center">
                                <div className="bg-white rounded-3xl p-8 shadow-xl border border-deepteal-200">
                                    <div className="flex items-center mb-6">
                                        <div className="w-16 h-16 bg-gradient-to-br from-deepteal-500 to-deepteal-600 rounded-xl flex items-center justify-center mr-4 text-white text-xl font-bold">
                                            PP
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-bold text-deepteal-700">PPUMPIT</h3>
                                            <p className="text-deepteal-600 font-semibold">DNA-sampling catamaran</p>
                                        </div>
                                    </div>
                                    <p className="text-deepteal-600 mb-4 text-lg leading-relaxed">
                                        Development of an <strong>Environmental DNA-sampling catamaran</strong> with:
                                    </p>
                                    <ul className="space-y-2 text-deepteal-600 mb-4">
                                        <li>• Blue Robotics catamaran base</li>
                                        <li>• Smith-Root eDNA pump</li>
                                        <li>• Remotely controlled from shore or boat</li>
                                        <li>• Collects 18 L water samples filtered through DNA-specific membranes</li>
                                        <li>• Supports multiple replicates per trip</li>
                                    </ul>
                                    <Link
                                        href="https://github.com/SeatizenDOI/pilot-pumpit"
                                        className="inline-flex items-center text-deepteal-700 font-semibold hover:text-deepteal-800 animate-pulse transition-colors"
                                    >
                                        Learn more <ExternalLink className="w-4 h-4 ml-2" />
                                    </Link>
                                </div>
                                <div className="rounded-3xl flex items-center justify-center border border-deepteal-200 lg:order-1">
                                    <Image
                                        alt="katastrophe"
                                        src={"/homepage/plage.jpeg"}
                                        width={600}
                                        height={400}
                                        className="border rounded-3xl border-deepteal-200"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Partner Carousel */}
                <section className="mb-20">
                    <h2 className="text-4xl font-bold text-deepteal-800 text-center mb-12">
                        Research Partners & Collaborators
                    </h2>

                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-pearl-200">
                        <div className="relative">
                            <div className="flex items-center justify-between mb-6">
                                <button
                                    onClick={prevSlide}
                                    className="p-2 rounded-full bg-pearl-100 hover:bg-pearl-200 transition-colors"
                                >
                                    <ChevronLeft className="w-6 h-6 text-pearl-600" />
                                </button>
                                <h3 className="text-lg font-semibold text-pearl-700">Collaborative Network</h3>
                                <button
                                    onClick={nextSlide}
                                    className="p-2 rounded-full bg-pearl-100 hover:bg-pearl-200 transition-colors"
                                >
                                    <ChevronRight className="w-6 h-6 text-pearl-600" />
                                </button>
                            </div>

                            <div className="overflow-hidden">
                                <div
                                    className="flex transition-transform duration-1000 ease-in-out"
                                    style={{ transform: `translateX(-${currentLogoSlide * 100}%)` }}
                                >
                                    {Array.from({ length: Math.ceil(partnerLogos.length / 4) }).map((_, slideIndex) => (
                                        <div key={slideIndex} className="w-full flex-shrink-0">
                                            <div className="grid grid-cols-4 gap-8 items-center">
                                                {partnerLogos
                                                    .slice(slideIndex * 4, slideIndex * 4 + 4)
                                                    .map((partner, index) => (
                                                        <div key={index} className="flex flex-col items-center">
                                                            <div className="w-30 h-30 bg-pearl-100 rounded-xl flex items-center justify-center mb-2 hover:bg-pearl-200 transition-colors">
                                                                <Image
                                                                    width={200}
                                                                    height={200}
                                                                    src={partner.logo}
                                                                    alt={`Logo ${partner.name}`}
                                                                />
                                                            </div>
                                                            <span className="text-xs text-pearl-500 text-center">
                                                                {partner.name}
                                                            </span>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Carousel indicators */}
                            <div className="flex justify-center mt-6 space-x-2">
                                {Array.from({ length: Math.ceil(partnerLogos.length / 4) }).map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentLogoSlide(index)}
                                        className={`w-2 h-2 rounded-full transition-colors ${
                                            index === currentLogoSlide ? "bg-deepteal-600" : "bg-pearl-300"
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
                <HeavyStatsSection stats={heavyStats} />
            </main>
        </div>
    );
}
