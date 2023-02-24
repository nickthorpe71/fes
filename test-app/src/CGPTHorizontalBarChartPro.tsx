import React, { useEffect, useRef } from "react";

interface DataPoint {
    label: string;
    value: number;
}

interface BarChartProps {
    data: DataPoint[];
    barColor?: string;
    labelColor?: string;
    barHeight?: number;
    barWidth?: number;
}

const BarChart: React.FC<BarChartProps> = ({
    data,
    barColor = "bg-blue-500",
    labelColor = "text-gray-500",
    barHeight = 6,
    barWidth = 100,
}) => {
    const maxBarValue = Math.max(...data.map((d) => d.value));
    const barRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        // Initialize refs
        barRefs.current = barRefs.current.slice(0, data.length);
    }, [data]);

    useEffect(() => {
        // Animate bars on mount and whenever data changes
        barRefs.current.forEach((barRef, i) => {
            if (barRef) {
                const { value } = data[i];
                const percentage = (value / maxBarValue) * 100;
                barRef.style.width = `${percentage}%`;
            }
        });
    }, [data, maxBarValue]);

    return (
        <div className='w-full'>
            {data.map((dataPoint, i) => (
                <div key={i} className='mb-2'>
                    <p className={labelColor}>{dataPoint.label}</p>
                    <div
                        className={`h-${barHeight} w-${barWidth} rounded-full overflow-hidden`}
                        ref={(ref) => (barRefs.current[i] = ref)}
                    >
                        <div className={`h-full ${barColor}`}></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BarChart;
