"use client";

import React, { useState, useEffect } from "react";
import { X, Trash2, Edit } from "lucide-react";
import { toast } from "react-toastify";
import { getThresholdsService, deleteThresholdService, updateThresholdService } from "@/app/services/thresholdService";
import { ThresholdResponse } from "@/app/types/thresholdType";

interface ViewThresholdModalProps {
    isOpen: boolean;
    onClose: () => void;
    refreshTrigger?: number;
    onSuccess?: () => void;
}

const ViewThresholdModal = ({ isOpen, onClose, refreshTrigger, onSuccess }: ViewThresholdModalProps) => {
    const [thresholds, setThresholds] = useState<ThresholdResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingSn, setEditingSn] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({
        expense_threshold_amount: 0,
        frequency: "Monthly" as "Monthly" | "Yearly",
        isEnable: true,
    });

    const fetchThresholds = async () => {
        try {
            setLoading(true);
            const data = await getThresholdsService();
            setThresholds(data);
            console.log(data);
        } catch (error: any) {
            toast.error(error.message || "Failed to fetch thresholds");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchThresholds();
        }
    }, [isOpen, refreshTrigger]);

    // Start editing a row
    const startEdit = (threshold: ThresholdResponse) => {
        setEditingSn(threshold.sn);
        setEditForm({
            expense_threshold_amount: threshold.expense_threshold_amount,
            frequency: threshold.frequency,
            isEnable: threshold.isEnable,
        });
    };

    // Cancel editing
    const cancelEdit = () => {
        setEditingSn(null);
        setEditForm({
            expense_threshold_amount: 0,
            frequency: "Monthly",
            isEnable: true,
        });
    };

    // Save update
    const saveEdit = async (sn: string) => {
        try {
            // Check if trying to enable this threshold when another one of the SAME frequency is already enabled
            if (editForm.isEnable) {
                const otherEnabledThreshold = thresholds.find(
                    t => t.sn !== sn && t.isEnable === true && t.frequency === editForm.frequency
                );

                if (otherEnabledThreshold) {
                    toast.error(`Cannot enable this ${editForm.frequency.toLowerCase()} threshold. Another ${editForm.frequency.toLowerCase()} threshold is already enabled. Please disable it first.`);
                    return;
                }
            }

            await updateThresholdService(sn, editForm);
            console.log(editForm);
            toast.success("Threshold updated successfully");
            setThresholds((prev) =>
                prev.map((item) =>
                    item.sn === sn
                        ? {
                            ...item,
                            expense_threshold_amount: editForm.expense_threshold_amount,
                            frequency: editForm.frequency,
                            isEnable: editForm.isEnable,
                        }
                        : item
                )
            );
            cancelEdit();
            onSuccess && onSuccess(); // Trigger parent refresh
        } catch (error: any) {
            toast.error(error.message || "Failed to update threshold");
        }
    };

    const handleDelete = async (sn: string) => {
        if (!confirm("Are you sure you want to delete this threshold?")) {
            return;
        }

        try {
            await deleteThresholdService(sn);
            toast.success("Threshold deleted successfully");
            fetchThresholds(); // Refresh the list
            onSuccess && onSuccess(); // Trigger parent refresh
        } catch (error: any) {
            toast.error(error.message || "Failed to delete threshold");
        }
    };

    // Format date safely
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return "Invalid Date";
            }
            return date.toLocaleDateString();
        } catch (error) {
            return "Invalid Date";
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">View Expense Thresholds</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    {loading ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">Loading thresholds...</p>
                        </div>
                    ) : thresholds.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No thresholds found. Add one to get started!</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                                            <th className="border border-gray-300 px-4 py-2 text-left">Amount</th>
                                            <th className="border border-gray-300 px-4 py-2 text-left">Frequency</th>
                                            <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                                            <th className="border border-gray-300 px-4 py-2 text-left">Created Date</th>
                                            <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {thresholds.map((threshold) => (
                                            <tr key={threshold.id} className="hover:bg-gray-50">
                                                <td className="border border-gray-300 px-4 py-2">{threshold.id}</td>
                                                <td className="border border-gray-300 px-4 py-2 font-semibold">
                                                    {editingSn === threshold.sn ? (
                                                        <input
                                                            type="number"
                                                            className="p-2 border rounded-md border-gray-300 w-full"
                                                            value={editForm.expense_threshold_amount}
                                                            onChange={(e) =>
                                                                setEditForm((prev) => ({
                                                                    ...prev,
                                                                    expense_threshold_amount: Number(e.target.value),
                                                                }))
                                                            }
                                                        />
                                                    ) : (
                                                        Number(threshold.expense_threshold_amount).toLocaleString()
                                                    )}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {editingSn === threshold.sn ? (
                                                        <select
                                                            className="p-2 border rounded-md border-gray-300 w-full capitalize"
                                                            value={editForm.frequency}
                                                            onChange={(e) =>
                                                                setEditForm((prev) => ({
                                                                    ...prev,
                                                                    frequency: e.target.value as "Monthly" | "Yearly",
                                                                }))
                                                            }
                                                        >
                                                            <option value="Monthly">Monthly</option>
                                                            <option value="Yearly">Yearly</option>
                                                        </select>
                                                    ) : (
                                                        <span className="capitalize">{threshold.frequency}</span>
                                                    )}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {editingSn === threshold.sn ? (
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                className="sr-only peer"
                                                                checked={editForm.isEnable}
                                                                onChange={(e) => {
                                                                    const newValue = e.target.checked;
                                                                    // Check if trying to enable when another of the SAME frequency is already enabled
                                                                    if (newValue) {
                                                                        const otherEnabled = thresholds.find(
                                                                            t => t.sn !== threshold.sn && t.isEnable === true && t.frequency === editForm.frequency
                                                                        );
                                                                        if (otherEnabled) {
                                                                            toast.warning(`Another ${editForm.frequency.toLowerCase()} threshold is already enabled. Disable it first.`);
                                                                            return;
                                                                        }
                                                                    }
                                                                    setEditForm((prev) => ({
                                                                        ...prev,
                                                                        isEnable: newValue,
                                                                    }))
                                                                }}
                                                            />
                                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FFA726]/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FFAA00]"></div>
                                                            <span className="ms-3 text-sm font-medium text-gray-700">
                                                                {editForm.isEnable ? "Enabled" : "Disabled"}
                                                            </span>
                                                        </label>
                                                    ) : (
                                                        <span
                                                            className={`px-2 py-1 rounded text-xs font-semibold ${threshold.isEnable
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-red-100 text-red-800"
                                                                }`}
                                                        >
                                                            {threshold.isEnable ? "Enabled" : "Disabled"}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {formatDate(threshold.create_date)}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2 text-center">
                                                    {editingSn === threshold.sn ? (
                                                        <>
                                                            <button
                                                                className="text-green-600 hover:text-green-800 font-medium mr-2 cursor-pointer"
                                                                onClick={() => saveEdit(threshold.sn)}
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                className="text-gray-600 hover:text-gray-800 font-medium cursor-pointer"
                                                                onClick={cancelEdit}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => startEdit(threshold)}
                                                                className="text-blue-600 hover:text-blue-800 transition-colors mr-2 cursor-pointer"
                                                                title="Edit"
                                                            >
                                                                <Edit className="w-5 h-5 inline" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(threshold.sn)}
                                                                className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="w-5 h-5 inline" />
                                                            </button>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="lg:hidden space-y-4">
                                {thresholds.map((threshold) => (
                                    <div
                                        key={threshold.id}
                                        className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 flex flex-col gap-3"
                                    >
                                        {/* Row 1: ID and Actions */}
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-bold text-gray-800">
                                                ID {threshold.id}
                                            </span>
                                            <div className="flex gap-2 text-xs font-bold">
                                                {editingSn === threshold.sn ? (
                                                    <>
                                                        <button
                                                            onClick={() => saveEdit(threshold.sn)}
                                                            className="text-green-600 hover:underline"
                                                        >
                                                            Save
                                                        </button>
                                                        <span className="text-gray-300">/</span>
                                                        <button
                                                            onClick={cancelEdit}
                                                            className="text-gray-500 hover:underline"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => startEdit(threshold)}
                                                            className="text-blue-600 hover:underline"
                                                        >
                                                            Edit
                                                        </button>
                                                        <span className="text-gray-300">/</span>
                                                        <button
                                                            onClick={() => handleDelete(threshold.sn)}
                                                            className="text-red-600 hover:underline"
                                                        >
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Row 2: Content */}
                                        <div className="flex flex-col gap-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-500">Amount:</span>
                                                {editingSn === threshold.sn ? (
                                                    <input
                                                        type="number"
                                                        className="w-32 p-1 text-sm border rounded focus:ring-1 focus:ring-[#FFAA00]"
                                                        value={editForm.expense_threshold_amount}
                                                        onChange={(e) =>
                                                            setEditForm((prev) => ({
                                                                ...prev,
                                                                expense_threshold_amount: Number(e.target.value),
                                                            }))
                                                        }
                                                    />
                                                ) : (
                                                    <span className="font-semibold">{Number(threshold.expense_threshold_amount).toLocaleString()}</span>
                                                )}
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-500">Frequency:</span>
                                                {editingSn === threshold.sn ? (
                                                    <select
                                                        className="w-32 p-1 text-sm border rounded"
                                                        value={editForm.frequency}
                                                        onChange={(e) =>
                                                            setEditForm((prev) => ({
                                                                ...prev,
                                                                frequency: e.target.value as "Monthly" | "Yearly",
                                                            }))
                                                        }
                                                    >
                                                        <option value="Monthly">Monthly</option>
                                                        <option value="Yearly">Yearly</option>
                                                    </select>
                                                ) : (
                                                    <span className="font-semibold capitalize">{threshold.frequency}</span>
                                                )}
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-500">Status:</span>
                                                {editingSn === threshold.sn ? (
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="sr-only peer"
                                                            checked={editForm.isEnable}
                                                            onChange={(e) => {
                                                                const newValue = e.target.checked;
                                                                // Check if trying to enable when another of the SAME frequency is already enabled
                                                                if (newValue) {
                                                                    const otherEnabled = thresholds.find(
                                                                        t => t.sn !== threshold.sn && t.isEnable === true && t.frequency === editForm.frequency
                                                                    );
                                                                    if (otherEnabled) {
                                                                        toast.warning(`Another ${editForm.frequency.toLowerCase()} threshold is already enabled. Disable it first.`);
                                                                        return;
                                                                    }
                                                                }
                                                                setEditForm((prev) => ({
                                                                    ...prev,
                                                                    isEnable: newValue,
                                                                }))
                                                            }}
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FFA726]/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FFAA00]"></div>
                                                        <span className="ms-3 text-xs font-medium text-gray-700">
                                                            {editForm.isEnable ? "Enabled" : "Disabled"}
                                                        </span>
                                                    </label>
                                                ) : (
                                                    <span
                                                        className={`px-2 py-0.5 rounded text-xs font-semibold ${threshold.isEnable
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                            }`}
                                                    >
                                                        {threshold.isEnable ? "Enabled" : "Disabled"}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex justify-between items-center text-xs text-gray-400 mt-1">
                                                <span>Created: {formatDate(threshold.create_date)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewThresholdModal;
