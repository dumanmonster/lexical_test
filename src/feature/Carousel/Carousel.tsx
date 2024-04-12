import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';

export const Carousel = ({ images, autoSlide = false, autoSlideInterval = 3000 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const intervalRef = useRef(null);

    // Group images into pairs for each slide
    const [slides, setSlides] = useState([])

    useEffect(() => {
        const pairs = []
        for (let i = 0; i < images.length; i += 2) {
           pairs.push([images?.[i], images?.[i + 1]])
        }
        setSlides(pairs)
    }, [images]);
    useEffect(() => {
        console.log(slides)
    }, [slides]);


    const prev = () => setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
    const next = () => setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));

    useEffect(() => {
        if (autoSlide) {
            intervalRef.current = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
            }, autoSlideInterval);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [autoSlide, autoSlideInterval]);

    return (
        <div className="relative overflow-hidden">
            <div className="flex transition-transform ease-out duration-500" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {slides?.map((slide, index) => (
                    <div key={index} className="w-full h-full flex-shrink-0 flex justify-evenly ">
                        <div className="w-1/3  overflow-hidden aspect-square">
                            <img src={slide?.[0]?.src} alt={`Slide ${index + 1}`} className="object-cover w-full h-full" />
                        </div>
                        <div className="w-1/3  overflow-hidden aspect-square">
                            {slide?.[1] && <img src={slide?.[1]?.src} alt={`Slide ${index + 1}`} className="object-cover w-full h-full" />}
                        </div>
                    </div>
                ))}
            </div>
            {slides?.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none">
                    <button onClick={prev} className="pointer-events-auto p-2 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white">
                        <ChevronLeft />
                    </button>
                    <button onClick={next} className="pointer-events-auto p-2 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white">
                        <ChevronRight />
                    </button>
                </div>
            )}
        </div>
    );
};

