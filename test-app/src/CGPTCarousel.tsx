import React, { useState } from "react";

interface CarouselProps {
    images: string[];
    mainImageWidth?: number;
    mainImageHeight?: number;
}

const Carousel: React.FC<CarouselProps> = ({
    images,
    mainImageWidth,
    mainImageHeight,
}) => {
    const [index, setIndex] = useState(0);

    const handlePrev = () => {
        setIndex((index - 1 + images.length) % images.length);
    };

    const handleNext = () => {
        setIndex((index + 1) % images.length);
    };

    return (
        <div className='relative w-full h-full'>
            {images.map((image, i) => (
                <img
                    key={i}
                    className={`absolute inset-0 object-cover transition-opacity duration-500 ${
                        i === index ? "opacity-100" : "opacity-0"
                    }`}
                    src={image}
                    alt={`Image ${i}`}
                />
            ))}
            <div className='absolute inset-0 flex items-center justify-between z-10'>
                <button
                    className='text-2xl font-bold text-white focus:outline-none'
                    onClick={handlePrev}
                >
                    &#8249;
                </button>
                <button
                    className='text-2xl font-bold text-white focus:outline-none'
                    onClick={handleNext}
                >
                    &#8250;
                </button>
            </div>
            <div className='absolute bottom-0 w-full flex justify-center'>
                {images.map((_, i) => (
                    <div
                        key={i}
                        className={`h-3 w-3 mx-2 rounded-full transition-opacity duration-500 ${
                            i === index ? "bg-white" : "bg-gray-400"
                        }`}
                    />
                ))}
            </div>
            <div className='absolute inset-0 flex items-center justify-center'>
                <img
                    className='absolute left-0 z-9 object-contain h-60 opacity-50'
                    src={images[(index - 1 + images.length) % images.length]}
                    alt={`Image ${index - 1}`}
                />
                <img
                    className='absolute right-0 z-9 object-contain h-60 opacity-50'
                    src={images[(index + 1) % images.length]}
                    alt={`Image ${index + 1}`}
                />
                {/* <img
                    className={`object-contain h-${mainImageHeight} w-${mainImageWidth} transition-opacity duration-500`}
                    src={images[index]}
                    alt={`Image ${index}`}
                /> */}
            </div>
        </div>
    );
};

export default Carousel;
