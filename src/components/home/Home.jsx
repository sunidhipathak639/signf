import React, { useState, useEffect } from 'react'
import {Header,WhatComp, Features, CTA, Working, Testimonials} from '.././index';
import InteractiveBackground from './InteractiveBackground';

const Home = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        // Check on mount
        checkMobile();

        // Add event listener for window resize
        window.addEventListener('resize', checkMobile);

        // Cleanup
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const content = (
        <>
            <Header/>
            <WhatComp/>
            <Features/>
            <Working/>
            <CTA/>
        </>
    );

    return (
        isMobile ? (
            <div>
                {content}
            </div>
        ) : (
            <InteractiveBackground>
                {content}
            </InteractiveBackground>
        )
    )
}

export default Home
