"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { OnboardingFormData } from "@/lib/types";

// ─── Static config ────────────────────────────────────────────────────────────

const STEPS = [
    {
        index: 0,
        title: "About You",
        subtitle: "Let's start with the basics.",
        xpReward: 75,
        unlockFeature: null,
    },
    {
        index: 1,
        title: "Your Finances",
        subtitle: "Help landlords understand your situation.",
        xpReward: 100,
        unlockFeature: {
            icon: "person_check",
            name: "Tenant Score",
            description: "See exactly how landlords rate you — and why.",
        },
    },
    {
        index: 2,
        title: "Your Household",
        subtitle: "Who's moving in with you?",
        xpReward: 75,
        unlockFeature: {
            icon: "description",
            name: "AI Cover Letter",
            description: "Personalised German cover letters generated in seconds.",
        },
    },
    {
        index: 3,
        title: "Your Search",
        subtitle: "Tell us what you're looking for.",
        xpReward: 125,
        unlockFeature: {
            icon: "bolt",
            name: "Smart Feed",
            description: "AI-ranked listings matching your exact profile.",
        },
    },
] as const;

const MAX_XP = 375;

const BERLIN_DISTRICTS = [
    "Mitte",
    "Prenzlauer Berg",
    "Friedrichshain",
    "Kreuzberg",
    "Neukölln",
    "Charlottenburg",
    "Schöneberg",
    "Tempelhof",
    "Wedding",
    "Steglitz",
    "Wilmersdorf",
    "Spandau",
    "Reinickendorf",
    "Treptow",
    "Köpenick",
];

const EMPLOYMENT_OPTIONS = [
    { value: "<6m", label: "<6m" },
    { value: "6-12m", label: "6–12m" },
    { value: "1-2yr", label: "1–2yr" },
    { value: "2yr+", label: "2yr+" },
];

const ROOM_OPTIONS = [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4+" },
];

// ─── Shared input class ───────────────────────────────────────────────────────

const INPUT_CLS =
    "w-full border border-gray-300 bg-white px-4 py-3.5 font-sans text-sm text-black placeholder:text-gray-400 outline-none transition focus:border-black";

// ─── Helper components ────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
    return (
        <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">
            {children}
        </label>
    );
}

function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="mt-1.5 text-xs text-red-500">{message}</p>;
}

function RequiredBadge() {
    return (
        <span
            className="inline-block ml-1.5 h-1.5 w-1.5 rounded-full bg-red-500 align-middle"
            aria-label="required"
        />
    );
}

function FieldHint({ children }: { children: React.ReactNode }) {
    return (
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-gray-400">
            {children}
        </p>
    );
}

function ButtonGroup<T extends string | number>({
    options,
    value,
    onChange,
}: {
    options: { value: T; label: string }[];
    value: T | undefined;
    onChange: (v: T) => void;
}) {
    return (
        <div className="flex gap-2 flex-wrap">
            {options.map((opt) => (
                <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => onChange(opt.value)}
                    className={`px-5 py-2.5 text-sm font-semibold border transition-colors ${
                        value === opt.value
                            ? "bg-black text-white border-black"
                            : "bg-white text-gray-700 border-gray-300 hover:border-black"
                    }`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}

function YesNoToggle({
    value,
    onChange,
    labelYes = "Yes",
    labelNo = "No",
}: {
    value: boolean;
    onChange: (v: boolean) => void;
    labelYes?: string;
    labelNo?: string;
}) {
    return (
        <div className="flex gap-0 border border-gray-300">
            <button
                type="button"
                onClick={() => onChange(true)}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                    value
                        ? "bg-black text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
            >
                {labelYes}
            </button>
            <div className="w-px bg-gray-300" />
            <button
                type="button"
                onClick={() => onChange(false)}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                    !value
                        ? "bg-black text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
            >
                {labelNo}
            </button>
        </div>
    );
}

function NumberStepper({
    value,
    onChange,
    min = 1,
    max = 5,
}: {
    value: number;
    onChange: (v: number) => void;
    min?: number;
    max?: number;
}) {
    return (
        <div className="flex items-center border border-gray-300 w-fit">
            <button
                type="button"
                onClick={() => onChange(Math.max(min, value - 1))}
                disabled={value <= min}
                className="flex h-12 w-12 items-center justify-center text-lg font-bold text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-30 border-r border-gray-300"
            >
                −
            </button>
            <span className="w-16 text-center text-xl font-black text-black">
                {value >= max ? `${max}+` : value}
            </span>
            <button
                type="button"
                onClick={() => onChange(Math.min(max, value + 1))}
                disabled={value >= max}
                className="flex h-12 w-12 items-center justify-center text-lg font-bold text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-30 border-l border-gray-300"
            >
                +
            </button>
        </div>
    );
}

function FeatureUnlockCard({
    feature,
    isHiding,
}: {
    feature: { icon: string; name: string; description: string };
    isHiding: boolean;
}) {
    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm ${isHiding ? "unlock-backdrop-exit" : "unlock-backdrop-enter"}`}>
            <div className={`bg-white max-w-sm w-full mx-6 border border-gray-200 ${isHiding ? "" : "unlock-reveal"}`}>
                <div className="border-b border-gray-200 px-8 py-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gray-400">
                        Feature Unlocked
                    </p>
                </div>
                <div className="px-8 py-8 text-center">
                    <span
                        className="material-symbols-outlined text-[40px] text-black leading-none"
                        style={{ fontVariationSettings: '"FILL" 0, "wght" 300, "GRAD" 0, "opsz" 40' }}
                    >
                        {feature.icon}
                    </span>
                    <h3 className="mt-4 text-2xl font-black tracking-tight text-black">
                        {feature.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500">
                        {feature.description}
                    </p>
                </div>
            </div>
        </div>
    );
}

// ─── Step panels ──────────────────────────────────────────────────────────────

function StepAboutYou({
    formData,
    onChange,
    errors,
}: {
    formData: OnboardingFormData;
    onChange: (patch: Partial<OnboardingFormData>) => void;
    errors: Record<string, string>;
}) {
    return (
        <div className="border-t border-l border-gray-200">
            <div className="grid md:grid-cols-2 border-b border-r border-gray-200">
                <div className="border-b md:border-b-0 md:border-r border-gray-200 p-6 md:p-8">
                    <FieldLabel>Full name<RequiredBadge /></FieldLabel>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => onChange({ name: e.target.value })}
                        placeholder="Anna Müller"
                        className={INPUT_CLS}
                    />
                    <FieldError message={errors.name} />
                    <FieldHint>Your full legal name as it appears on your ID</FieldHint>
                </div>
                <div className="p-6 md:p-8">
                    <FieldLabel>Email address<RequiredBadge /></FieldLabel>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => onChange({ email: e.target.value })}
                        placeholder="anna@example.com"
                        className={INPUT_CLS}
                    />
                    <FieldError message={errors.email} />
                    <FieldHint>Used to send you listings and your tenant score report</FieldHint>
                </div>
            </div>
            <div className="border-b border-r border-gray-200 p-6 md:p-8">
                <FieldLabel>Phone number</FieldLabel>
                <input
                    type="tel"
                    value={formData.phone ?? ""}
                    onChange={(e) => onChange({ phone: e.target.value })}
                    placeholder="+49 170 123 4567"
                    className={INPUT_CLS}
                />
                <FieldHint>Optional — used for direct contact by landlords</FieldHint>
            </div>
        </div>
    );
}

function StepFinances({
    formData,
    onChange,
}: {
    formData: OnboardingFormData;
    onChange: (patch: Partial<OnboardingFormData>) => void;
}) {
    return (
        <div className="border-t border-l border-gray-200">
            <div className="grid md:grid-cols-2 border-b border-r border-gray-200">
                <div className="border-b md:border-b-0 md:border-r border-gray-200 p-6 md:p-8">
                    <FieldLabel>Occupation</FieldLabel>
                    <input
                        type="text"
                        value={formData.occupation ?? ""}
                        onChange={(e) => onChange({ occupation: e.target.value })}
                        placeholder="Software Engineer"
                        className={INPUT_CLS}
                    />
                    <FieldHint>Your current job title or employment status</FieldHint>
                </div>
                <div className="p-6 md:p-8">
                    <FieldLabel>Monthly net income (€)</FieldLabel>
                    <input
                        type="number"
                        min={0}
                        value={formData.monthlyNetIncomeEur ?? ""}
                        onChange={(e) =>
                            onChange({
                                monthlyNetIncomeEur: e.target.value
                                    ? Number(e.target.value)
                                    : undefined,
                            })
                        }
                        placeholder="3000"
                        className={INPUT_CLS}
                    />
                    <FieldHint>Your net take-home pay after taxes, per month</FieldHint>
                </div>
            </div>
            <div className="grid md:grid-cols-2 border-b border-r border-gray-200">
                <div className="border-b md:border-b-0 md:border-r border-gray-200 p-6 md:p-8">
                    <FieldLabel>Employment duration</FieldLabel>
                    <ButtonGroup
                        options={EMPLOYMENT_OPTIONS}
                        value={formData.stableEmploymentMonths}
                        onChange={(v) => onChange({ stableEmploymentMonths: v })}
                    />
                    <FieldHint>How long you've been continuously employed</FieldHint>
                </div>
                <div className="p-6 md:p-8">
                    <FieldLabel>Schufa certificate</FieldLabel>
                    <YesNoToggle
                        value={formData.hasSchufa}
                        onChange={(v) => onChange({ hasSchufa: v })}
                        labelYes="Yes, I have one"
                        labelNo="Not yet"
                    />
                    <FieldHint>A clean Schufa significantly boosts your tenant score</FieldHint>
                </div>
            </div>
        </div>
    );
}

function StepHousehold({
    formData,
    onChange,
}: {
    formData: OnboardingFormData;
    onChange: (patch: Partial<OnboardingFormData>) => void;
}) {
    return (
        <div className="border-t border-l border-gray-200">
            <div className="grid md:grid-cols-2 border-b border-r border-gray-200">
                <div className="border-b md:border-b-0 md:border-r border-gray-200 p-6 md:p-8">
                    <FieldLabel>Household size (including yourself)</FieldLabel>
                    <NumberStepper
                        value={formData.householdSize}
                        onChange={(v) => onChange({ householdSize: v })}
                        min={1}
                        max={5}
                    />
                    <FieldHint>Including yourself — affects which apartment sizes qualify</FieldHint>
                </div>
                <div className="p-6 md:p-8">
                    <FieldLabel>Pets</FieldLabel>
                    <YesNoToggle
                        value={formData.hasPets}
                        onChange={(v) => onChange({ hasPets: v })}
                    />
                    <FieldHint>Dogs, cats, or other animals in your household</FieldHint>
                </div>
            </div>
            {formData.hasPets && (
                <div className="border-b border-r border-gray-200 p-6 md:p-8 step-enter">
                    <FieldLabel>Describe your pets</FieldLabel>
                    <input
                        type="text"
                        value={formData.petsDescription ?? ""}
                        onChange={(e) => onChange({ petsDescription: e.target.value })}
                        placeholder="1 small dog, very quiet"
                        className={INPUT_CLS}
                    />
                    <FieldHint>A brief description helps reassure landlords</FieldHint>
                </div>
            )}
        </div>
    );
}

function StepSearch({
    formData,
    onChange,
}: {
    formData: OnboardingFormData;
    onChange: (patch: Partial<OnboardingFormData>) => void;
}) {
    function toggleDistrict(district: string) {
        const current = formData.preferredDistricts;
        const next = current.includes(district)
            ? current.filter((d) => d !== district)
            : [...current, district];
        onChange({ preferredDistricts: next });
    }

    return (
        <div className="border-t border-l border-gray-200">
            <div className="border-b border-r border-gray-200 p-6 md:p-8">
                <FieldLabel>Preferred Berlin districts</FieldLabel>
                <div className="flex flex-wrap gap-2 mt-1">
                    {BERLIN_DISTRICTS.map((district) => {
                        const selected = formData.preferredDistricts.includes(district);
                        return (
                            <button
                                key={district}
                                type="button"
                                onClick={() => toggleDistrict(district)}
                                className={`px-3 py-1.5 text-xs font-semibold border transition-colors ${
                                    selected
                                        ? "bg-black text-white border-black"
                                        : "bg-white text-gray-600 border-gray-300 hover:border-black"
                                }`}
                            >
                                {district}
                            </button>
                        );
                    })}
                </div>
                <FieldHint>Select one or more Berlin districts you'd like to live in</FieldHint>
            </div>
            <div className="grid md:grid-cols-3 border-b border-r border-gray-200">
                <div className="border-b md:border-b-0 md:border-r border-gray-200 p-6 md:p-8">
                    <FieldLabel>Max. warm rent (€/mo)</FieldLabel>
                    <input
                        type="number"
                        min={0}
                        value={formData.maxWarmRent ?? ""}
                        onChange={(e) =>
                            onChange({
                                maxWarmRent: e.target.value
                                    ? Number(e.target.value)
                                    : undefined,
                            })
                        }
                        placeholder="1500"
                        className={INPUT_CLS}
                    />
                    <FieldHint>Maximum total monthly rent including heating and utilities (Warmmiete)</FieldHint>
                </div>
                <div className="border-b md:border-b-0 md:border-r border-gray-200 p-6 md:p-8">
                    <FieldLabel>Minimum rooms</FieldLabel>
                    <ButtonGroup
                        options={ROOM_OPTIONS}
                        value={formData.minRooms}
                        onChange={(v) => onChange({ minRooms: v })}
                    />
                    <FieldHint>Minimum number of rooms needed (living room counts)</FieldHint>
                </div>
                <div className="p-6 md:p-8">
                    <FieldLabel>Minimum size (m²)</FieldLabel>
                    <input
                        type="number"
                        min={0}
                        value={formData.minAreaM2 ?? ""}
                        onChange={(e) =>
                            onChange({
                                minAreaM2: e.target.value
                                    ? Number(e.target.value)
                                    : undefined,
                            })
                        }
                        placeholder="50"
                        className={INPUT_CLS}
                    />
                    <FieldHint>Minimum apartment size in square meters</FieldHint>
                </div>
            </div>
            <div className="border-b border-r border-gray-200 p-6 md:p-8">
                <FieldLabel>WBS (Wohnberechtigungsschein) required</FieldLabel>
                <YesNoToggle
                    value={formData.wbsRequired}
                    onChange={(v) => onChange({ wbsRequired: v })}
                />
                <FieldHint>Wohnberechtigungsschein — required for subsidized affordable housing</FieldHint>
            </div>
        </div>
    );
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validateStep(
    step: number,
    data: OnboardingFormData
): Record<string, string> {
    const errs: Record<string, string> = {};
    if (step === 0) {
        if (!data.name.trim()) errs.name = "Name is required";
        if (!data.email.trim()) {
            errs.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errs.email = "Invalid email address";
        }
    }
    return errs;
}

// ─── API helpers ──────────────────────────────────────────────────────────────

async function postTenant(data: OnboardingFormData): Promise<string> {
    const res = await fetch("/api/tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: data.name,
            email: data.email,
            phone: data.phone || undefined,
            monthlyNetIncomeEur: data.monthlyNetIncomeEur,
            householdSize: data.householdSize,
            hasPets: data.hasPets,
            hasSchufa: data.hasSchufa,
        }),
    });
    if (res.status === 409) {
        throw new Error("duplicate_email");
    }
    if (!res.ok) {
        throw new Error("Failed to create profile");
    }
    const body = (await res.json()) as { data: { id: string } };
    return body.data.id;
}

async function putPreferences(
    tenantId: string,
    data: OnboardingFormData
): Promise<void> {
    const res = await fetch(`/api/tenants/${tenantId}/preferences`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            preferredDistricts: data.preferredDistricts,
            maxWarmRent: data.maxWarmRent,
            minRooms: data.minRooms,
            minAreaM2: data.minAreaM2,
            wbsRequired: data.wbsRequired,
            autoApplyEnabled: false,
        }),
    });
    if (!res.ok) {
        throw new Error("Failed to save preferences");
    }
}

// ─── Main page component ──────────────────────────────────────────────────────

export default function OnboardingPage() {
    const router = useRouter();

    const [currentStep, setCurrentStep] = useState(0);
    const [xp, setXp] = useState(0);
    const [showUnlock, setShowUnlock] = useState(false);
    const [isUnlockHiding, setIsUnlockHiding] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState<OnboardingFormData>({
        name: "",
        email: "",
        phone: "",
        occupation: "",
        monthlyNetIncomeEur: undefined,
        stableEmploymentMonths: undefined,
        hasSchufa: false,
        householdSize: 1,
        hasPets: false,
        petsDescription: "",
        preferredDistricts: [],
        maxWarmRent: undefined,
        minRooms: undefined,
        minAreaM2: undefined,
        wbsRequired: false,
    });

    function patchForm(patch: Partial<OnboardingFormData>) {
        setFormData((prev) => ({ ...prev, ...patch }));
    }

    function saveToLocalStorage(tenantId: string, completedStep: number) {
        const prev = JSON.parse(
            localStorage.getItem("budenfinder.onboarding") ?? "{}"
        );
        const newXp = xp + STEPS[currentStep].xpReward;
        localStorage.setItem(
            "budenfinder.onboarding",
            JSON.stringify({
                ...prev,
                tenantId,
                name: formData.name,
                totalXp: newXp,
                completedSteps: [
                    ...(prev.completedSteps ?? []),
                    completedStep,
                ],
            })
        );
        localStorage.setItem("budenfinder.tenant-id", tenantId);
    }

    function advanceStep() {
        setCurrentStep((s) => s + 1);
    }

    function dismissUnlock(onDone: () => void) {
        setIsUnlockHiding(true);
        setTimeout(() => {
            setIsUnlockHiding(false);
            setShowUnlock(false);
            onDone();
        }, 400);
    }

    async function handleNext() {
        const errs = validateStep(currentStep, formData);
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }
        setErrors({});
        setIsSubmitting(true);

        try {
            if (currentStep === 0) {
                const existingId = localStorage.getItem("budenfinder.tenant-id");
                if (!existingId) {
                    const id = await postTenant(formData);
                    saveToLocalStorage(id, 0);
                }
            }

            if (currentStep === 3) {
                const tenantId = localStorage.getItem("budenfinder.tenant-id");
                if (tenantId) {
                    await putPreferences(tenantId, formData);
                }
                const stored = JSON.parse(
                    localStorage.getItem("budenfinder.onboarding") ?? "{}"
                );
                localStorage.setItem(
                    "budenfinder.onboarding",
                    JSON.stringify({
                        ...stored,
                        totalXp: MAX_XP,
                        completedSteps: [0, 1, 2, 3],
                    })
                );

                setXp(MAX_XP);
                setShowUnlock(true);
                setTimeout(() => {
                    dismissUnlock(() => router.push("/home"));
                }, 2500);
                return;
            }

            const newXp = xp + STEPS[currentStep].xpReward;
            setXp(newXp);

            const stepFeature = STEPS[currentStep].unlockFeature;
            if (stepFeature) {
                setShowUnlock(true);
                setTimeout(() => {
                    dismissUnlock(() => advanceStep());
                }, 2500);
            } else {
                advanceStep();
            }
        } catch (err) {
            if (err instanceof Error && err.message === "duplicate_email") {
                setErrors({
                    email: "An account with this email already exists.",
                });
            } else {
                setErrors({ _global: "Something went wrong. Please try again." });
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleBack() {
        if (currentStep > 0) setCurrentStep((s) => s - 1);
    }

    const step = STEPS[currentStep];
    const xpPct = Math.round((xp / MAX_XP) * 100);
    const unlockFeature = showUnlock ? STEPS[currentStep].unlockFeature : null;

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* ── Header ── */}
            <header className="fixed top-0 left-0 right-0 z-20 h-16 border-b border-gray-200 bg-white">
                <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6 md:px-10">
                    <span className="text-lg font-bold tracking-tighter text-black">
                        Budenfinder
                    </span>
                    <div className="flex items-center gap-6">
                        <span className="hidden sm:block font-mono text-[10px] uppercase tracking-[0.25em] text-gray-400">
                            Step {currentStep + 1} of {STEPS.length}
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#3ecfa0]">
                                {xp}
                                <span className="text-[#3ecfa0]/60 font-normal"> / {MAX_XP} XP</span>
                            </span>
                            <div className="w-20 h-1 bg-gray-200 overflow-hidden">
                                <div
                                    className="h-full bg-[#3ecfa0] transition-all duration-700 ease-out"
                                    style={{ width: `${xpPct}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Step progress track */}
                <div className="flex h-0.5">
                    {STEPS.map((s, i) => (
                        <div
                            key={i}
                            className={`flex-1 transition-colors duration-500 ${
                                i < currentStep
                                    ? "bg-[#3ecfa0]"
                                    : i === currentStep
                                      ? "bg-gray-400"
                                      : "bg-gray-100"
                            }`}
                        />
                    ))}
                </div>
            </header>

            {/* ── Main ── */}
            <main className="flex-1 pt-16">
                <section className="min-h-[calc(100vh-4rem)] flex items-start md:items-center px-6 py-12 md:py-16 md:px-10 lg:px-16">
                    <div className="mx-auto w-full max-w-4xl">
                        {/* Step header */}
                        <div key={currentStep} className="step-enter mb-8 md:mb-10">
                            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-400">
                                {step.title}
                                {step.xpReward > 0 && (
                                    <span className="ml-3 text-[#3ecfa0]">+{step.xpReward} XP</span>
                                )}
                            </p>
                            <h1 className="mt-3 text-4xl font-black leading-none tracking-tight text-black md:text-5xl">
                                {step.title}
                            </h1>
                            <p className="mt-3 text-base text-gray-500">
                                {step.subtitle}
                            </p>
                        </div>

                        {/* Step content */}
                        <div key={`content-${currentStep}`} className="step-enter">
                            {currentStep === 0 && (
                                <StepAboutYou
                                    formData={formData}
                                    onChange={patchForm}
                                    errors={errors}
                                />
                            )}
                            {currentStep === 1 && (
                                <StepFinances
                                    formData={formData}
                                    onChange={patchForm}
                                />
                            )}
                            {currentStep === 2 && (
                                <StepHousehold
                                    formData={formData}
                                    onChange={patchForm}
                                />
                            )}
                            {currentStep === 3 && (
                                <StepSearch
                                    formData={formData}
                                    onChange={patchForm}
                                />
                            )}
                        </div>

                        {/* Global error */}
                        {errors._global && (
                            <p className="mt-4 text-sm text-red-500">
                                {errors._global}
                            </p>
                        )}

                        {/* Navigation */}
                        {!showUnlock && (
                            <div className="mt-8 border-t border-gray-200 pt-8 flex items-center justify-between gap-4">
                                {currentStep > 0 ? (
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="border border-gray-300 px-8 py-3.5 text-sm font-semibold text-black transition-colors hover:bg-gray-50"
                                    >
                                        ← Back
                                    </button>
                                ) : (
                                    <div />
                                )}
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={isSubmitting}
                                    className="bg-black px-8 py-3.5 text-sm font-bold text-white transition-colors hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting
                                        ? "Saving…"
                                        : currentStep === STEPS.length - 1
                                          ? "Finish & Go to Dashboard →"
                                          : "Continue →"}
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* ── Feature unlock overlay ── */}
            {unlockFeature && <FeatureUnlockCard feature={unlockFeature} isHiding={isUnlockHiding} />}
        </div>
    );
}
