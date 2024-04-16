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

        </div>
    );
};

