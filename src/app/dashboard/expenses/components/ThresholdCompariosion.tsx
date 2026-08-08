import React, { useState, useEffect } from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';
import { compareThresholdWithExpensesService } from '@/app/services/thresholdService';
import { CompareExpenseAndThresholdResponse } from '@/app/types/thresholdType';

interface ExpenseThresholdProps {
    refreshTrigger?: number;
}

const ExpenseThreshold: React.FC<ExpenseThresholdProps> = ({ refreshTrigger = 0 }) => {
    const [filter, setFilter] = useState('monthly');
    const [data, setData] = useState<CompareExpenseAndThresholdResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const fetchData = async (filterType: string) => {
        setLoading(true);
        setError(null);
        try {
            const responseData = await compareThresholdWithExpensesService(filterType);
            setData(responseData);
        } catch (error: any) {
            // Check if it's a "no active threshold" error - treat as no data instead of error
            const errorMessage = error.message || '';
            const isNoThresholdError = errorMessage.toLowerCase().includes('no active') ||
                errorMessage.toLowerCase().includes('no threshold') ||
                errorMessage.toLowerCase().includes('not found');

            if (isNoThresholdError) {
                // This is expected when no threshold exists, not a real error
                setData(null);
                setError(null);
            } else {
                // This is an actual error (network, server, etc.)
                console.error('Error fetching threshold comparison data:', error);
                setError(errorMessage || 'Failed to load threshold data');
                setData(null);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(filter);
    }, [filter, refreshTrigger]);

    const handleFilterChange = (newFilter: string) => {
        setFilter(newFilter);
        setIsDropdownOpen(false);
    };

    // Loading state
    if (loading) {
        return (
            <div className="w-full p-6 bg-white rounded-lg shadow-md">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-16 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="w-full p-6 bg-white rounded-lg shadow-md">
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-md">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-red-800">{error}</p>
                </div>
            </div>
        );
    }

    // No data state - still show filter dropdown
    if (!data) {
        return (
            <div className="w-full p-6 bg-white rounded-lg shadow-md">
                {/* Header with Filter Dropdown */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <span className="text-gray-700 text-base sm:text-lg font-medium">
                        Expenses Threshold/Limit
                    </span>

                    {/* Filter Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors w-full sm:w-auto justify-between sm:justify-start"
                        >
                            <span className="capitalize">{filter}</span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-full sm:w-32 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                                <button
                                    onClick={() => handleFilterChange('monthly')}
                                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${filter === 'monthly' ? 'bg-gray-50 font-medium' : ''
                                        }`}
                                >
                                    Monthly
                                </button>
                                <button
                                    onClick={() => handleFilterChange('yearly')}
                                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${filter === 'yearly' ? 'bg-gray-50 font-medium' : ''
                                        }`}
                                >
                                    Yearly
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* No Data Message */}
                <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                    <p className="text-blue-800">No active {filter} threshold found. Please add a {filter} threshold to see the comparison.</p>
                </div>
            </div>
        );
    }

    const percentUsed = Math.min(data.percent_used || 0, 100);
    const percentRemaining = Math.max(100 - percentUsed, 0);
    const isExceeded = (data.exceeded_amount || 0) > 0;

    return (
        <div className="w-full p-6 bg-white rounded-lg shadow-md">
            {/* Header with Threshold and Dropdown */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <span className="text-gray-700 text-base sm:text-lg font-bold">
                        Expenses Threshold/Limit:
                    </span>
                    <span className="text-red-600 text-xl sm:text-2xl font-bold">
                        {data.symbol}{" "}{((Number(data.threshold_amount)) || 0).toLocaleString()}
                    </span>
                </div>

                {/* Custom Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors w-full sm:w-auto justify-between sm:justify-start"
                    >
                        <span className="capitalize">{filter}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-full sm:w-32 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                            <button
                                onClick={() => handleFilterChange('monthly')}
                                className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${filter === 'monthly' ? 'bg-gray-50 font-medium' : ''
                                    }`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => handleFilterChange('yearly')}
                                className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${filter === 'yearly' ? 'bg-gray-50 font-medium' : ''
                                    }`}
                            >
                                Yearly
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-3">
                <div className="flex rounded-lg overflow-hidden shadow-md min-h-[40px] relative">
                    {/* Spent Section */}
                    {percentUsed > 0 && (
                        <div
                            className="bg-red-600 flex items-center justify-center px-2 sm:px-4 py-3 transition-all duration-500 relative group cursor-pointer"
                            style={{ width: `${percentUsed}%` }}
                            title={`Spent: ${data.symbol} ${((Number(data.total_expenses)) || 0).toLocaleString()} (${percentUsed.toFixed(1)}%)`}
                        >
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg">
                                <div className="font-semibold">Spent Amount</div>
                                <div>{data.symbol} {((Number(data.total_expenses)) || 0).toLocaleString()}</div>
                                <div className="text-green-300">{percentUsed.toFixed(1)}% of threshold</div>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                            </div>

                            {/* Label - only show if section is wide enough */}
                            {percentUsed >= 5 && (
                                <span className="text-white font-bold text-sm sm:text-base text-center">
                                    {percentUsed.toFixed(1)}%
                                </span>
                            )}
                        </div>
                    )}

                    {/* Remaining Section */}
                    {!isExceeded && percentRemaining > 0 && (
                        <div
                            className="bg-green-600 flex items-center justify-center px-2 sm:px-4 py-3 transition-all duration-500 relative group cursor-pointer"
                            style={{ width: `${percentRemaining}%` }}
                            title={`Remaining: ${data.symbol} ${((Number(data.remaining_amount)) || 0).toLocaleString()} (${percentRemaining.toFixed(1)}%)`}
                        >
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg">
                                <div className="font-semibold">Remaining Budget</div>
                                <div>{data.symbol} {((Number(data.remaining_amount)) || 0).toLocaleString()}</div>
                                <div className="text-red-300">{percentRemaining.toFixed(1)}% remaining</div>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                            </div>

                            {/* Label - only show if section is wide enough */}
                            {percentRemaining >= 5 && (
                                <span className="text-white font-bold text-sm sm:text-base text-center">
                                    {percentRemaining.toFixed(1)}%
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Summary Row Below Progress Bar */}
                <div className="flex flex-col sm:flex-row justify-between gap-2 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-600 rounded"></div>
                        <span className="text-gray-700">
                            <span className="font-semibold">Spent:</span> {data.symbol} {((Number(data.total_expenses)) || 0).toLocaleString()}
                            <span className="text-gray-500 ml-1">({percentUsed.toFixed(1)}%)</span>
                        </span>
                    </div>
                    {!isExceeded && (
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-600 rounded"></div>
                            <span className="text-gray-700">
                                <span className="font-semibold">Remaining:</span> {data.symbol} {((Number(data.remaining_amount)) || 0).toLocaleString()}
                                <span className="text-gray-500 ml-1">({percentRemaining.toFixed(1)}%)</span>
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Warning Message */}
            {data.warning && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-yellow-800 text-sm">You have exceeded your monthly expense threshold by <strong>{data.exceeded_amount}</strong>. Please adjust your spending!</p>
                </div>
            )}


        </div>
    );
};

export default ExpenseThreshold;