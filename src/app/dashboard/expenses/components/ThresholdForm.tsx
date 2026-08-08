"use client";

import React, { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import { addThresholdService, getThresholdsService } from "@/app/services/thresholdService";
import { AddThresholdPayload } from "@/app/types/thresholdType";

interface ThresholdFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const ThresholdForm = ({ isOpen, onClose, onSuccess }: ThresholdFormProps) => {
    const [amount, setAmount] = useState<number | "">("");
    const [frequency, setFrequency] = useState<"Monthly" | "Yearly">("Monthly");
    const [isEnabled, setIsEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hasEnabledThreshold, setHasEnabledThreshold] = useState(false);
    const [checkingThresholds, setCheckingThresholds] = useState(false);

    // Check for existing enabled thresholds when modal opens
    useEffect(() => {
        const checkEnabledThresholds = async () => {
            if (!isOpen) return;

            try {
                setCheckingThresholds(true);
                const thresholds = await getThresholdsService();

                // Check if there's an enabled threshold of the SAME frequency
                const hasEnabledSameFrequency = thresholds.some(
                    t => t.isEnable === true && t.frequency === frequency
                );
                setHasEnabledThreshold(hasEnabledSameFrequency);

                // If there's already an enabled threshold of the same frequency, set this one to disabled
                if (hasEnabledSameFrequency) {
                    setIsEnabled(false);
                }
            } catch (error) {
                console.error("Failed to check thresholds:", error);
            } finally {
                setCheckingThresholds(false);
            }
        };

        checkEnabledThresholds();
    }, [isOpen, frequency]); // Re-check when frequency changes

    const handleSubmit = async () => {
        // Validation
        if (!amount || amount <= 0) {
            toast.error("Please enter a valid threshold amount");
            return;
        }

        // Check if trying to enable when another threshold of the same frequency is already enabled
        if (isEnabled && hasEnabledThreshold) {
            toast.error(`Cannot enable this ${frequency.toLowerCase()} threshold. Another ${frequency.toLowerCase()} threshold is already enabled. Please disable it first.`);
            return;
        }

        try {
            setLoading(true);

            const payload: AddThresholdPayload = {
                expense_threshold_amount: Number(amount),
                frequency: frequency,
                isEnable: isEnabled,
            };

            await addThresholdService(payload);

            toast.success(`Threshold of ${amount} added successfully.`);

            // Reset form
            setAmount("");
            setFrequency("Monthly");
            setIsEnabled(true);
            setHasEnabledThreshold(false);

            onSuccess && onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Failed to add threshold");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setAmount("");
        setFrequency("Monthly");
        setIsEnabled(true);
        setHasEnabledThreshold(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) handleClose();
            }}
        >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Add Expense Threshold</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <div className="p-6">
                    {/* Warning Message */}
                    {hasEnabledThreshold && (
                        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-amber-800 mb-1">
                                    Enabled {frequency} Threshold Already Exists
                                </h4>
                                <p className="text-sm text-amber-700">
                                    Only one {frequency.toLowerCase()} threshold can be enabled at a time. To enable this threshold, please disable the existing {frequency.toLowerCase()} threshold first from the View Thresholds section. Note: You can have one monthly and one yearly threshold enabled simultaneously.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
                        {/* Threshold Amount */}
                        <div className="flex-1 min-w-0">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 whitespace-nowrap">
                                Expense Threshold Amount
                            </label>
                            <input
                                type="number"
                                inputMode="decimal"
                                placeholder="0"
                                className="w-full h-12 px-3 text-md font-bold text-[#716A6A] 
                       border border-[#574A4A]/50 rounded outline-none 
                       focus:border-[#FFA726]
                       [appearance:textfield] 
                       [&::-webkit-outer-spin-button]:appearance-none 
                       [&::-webkit-inner-spin-button]:appearance-none"
                                value={amount}
                                onChange={(e) =>
                                    setAmount(e.target.value === "" ? "" : Number(e.target.value))
                                }
                            />
                        </div>

                        {/* Frequency */}
                        <div className="flex-1 min-w-0">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 whitespace-nowrap">
                                Frequency
                            </label>
                            <select
                                className="w-full h-12 px-3 text-md font-bold text-[#716A6A] 
                       border border-[#574A4A]/50 rounded outline-none 
                       focus:border-[#FFA726] bg-white"
                                value={frequency}
                                onChange={(e) => setFrequency(e.target.value as "Monthly" | "Yearly")}
                            >
                                <option value="Monthly">Monthly</option>
                                <option value="Yearly">Yearly</option>
                            </select>
                        </div>

                        {/* Enable/Disable Checkbox */}
                        <div className="flex-1 min-w-0">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 whitespace-nowrap">
                                Enable Threshold
                            </label>
                            <div className="flex items-center h-12">
                                <label className={`flex items-center gap-2 ${hasEnabledThreshold ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 text-[#FFAA00] bg-gray-100 border-gray-300 rounded focus:ring-[#FFA726] focus:ring-2"
                                        checked={isEnabled}
                                        onChange={(e) => setIsEnabled(e.target.checked)}
                                        disabled={hasEnabledThreshold}
                                    />
                                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                        {isEnabled ? "Enabled" : "Disabled"}
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Add Button */}
                        <div className="shrink-0 w-full lg:w-auto">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 invisible whitespace-nowrap">
                                Action
                            </label>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className={`bg-[#FFAA00] hover:bg-[#FFAA00]/90 text-white font-bold 
                        text-md px-8 h-12 w-full lg:w-auto rounded transition-colors 
                        cursor-pointer ${loading ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                            >
                                {loading ? "Adding..." : "Add"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThresholdForm;
