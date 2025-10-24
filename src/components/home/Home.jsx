import React from 'react'
import {Header,WhatComp, Features, CTA, Working, Testimonials} from '.././index';
import InteractiveBackground from './InteractiveBackground';

const Home = () => {
    return (
        <InteractiveBackground>
            <Header/>
            <WhatComp/>
            <Features/>
            <Working/>
            <CTA/>
        </InteractiveBackground>
    )
}

export default Home
