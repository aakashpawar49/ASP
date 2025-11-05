import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

/**
 * A reusable stat card for the dashboard.
 * @param {object} props
 * @param {string} props.title - The title of the card (e.g., "Bugs Fixed")
 * @param {string} props.value - The main number to display
 * @param {object} [props.change] - Optional change data
 * @param {'increase' | 'decrease'} props.change.type - Type of change
 * @param {string} props.change.value - The percentage (e.g., "11.0%")
 * @param {React.ReactNode} props.icon - The icon to display
 */
const StatCard = ({ title, value, change, icon }) => {
  const isIncrease = change?.type === 'increase';
  const changeColor = isIncrease ? 'text-green-500' : 'text-red-500';

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 dark:bg-gray-800 dark:border-gray-700 transition-all duration-200 hover:scale-[1.02]">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</span>
          <span className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</span>
        </div>
        {icon && (
          <div className="p-3 bg-blue-100 rounded-lg dark:bg-gray-700">
            {React.cloneElement(icon, { className: "w-6 h-6 text-blue-600 dark:text-blue-400" })}
          </div>
        )}
      </div>
      {change && (
        <div className="flex items-center text-sm mt-2">
          <span className={`flex items-center ${changeColor}`}>
            {isIncrease ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
            {change.value}
          </span>
          <span className="text-gray-500 ml-1">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
