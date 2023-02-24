import React, { useEffect, useRef, useState } from "react";

interface BarChartProps {
    data: { label: string; value: number }[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
    const [chartData, setChartData] =
        useState<{ label: string; value: number }[]>(data);

    const maxBarValue = Math.max(...chartData.map((d) => d.value));
    const barRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        // Initialize refs
        barRefs.current = barRefs.current.slice(0, chartData.length);
    }, [chartData]);

    useEffect(() => {
        // Animate bars on mount and whenever data changes
        barRefs.current.forEach((barRef, i) => {
            if (barRef) {
                const { value } = chartData[i];
                const percentage = (value / maxBarValue) * 100;
                barRef.style.width = `${percentage}%`;
            }
        });
    }, [chartData, maxBarValue]);

    return (
        <div className='w-full'>
            {chartData.map((dataPoint, i) => (
                <div key={i} className='mb-2'>
                    <div className='mb-1 text-gray-600'>{dataPoint.label}</div>
                    <div
                        className='bg-blue-500 h-6 rounded-full overflow-hidden'
                        ref={(ref) => (barRefs.current[i] = ref)}
                    >
                        <div className='h-full bg-white'></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BarChart;
