import React, { useEffect, useRef } from 'react';

export const StarryBackground: React.FC = () => {
    const stars1Ref = useRef<HTMLDivElement>(null);
    const stars2Ref = useRef<HTMLDivElement>(null);
    const stars3Ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            // The transform moves the layers *up* (negative Y) as the page scrolls down.
            // Farther layers (dimmer, smaller patterns) move slower (smaller multiplier).
            if (stars1Ref.current) { // Farthest
                stars1Ref.current.style.transform = `translateY(-${scrollY * 0.15}px)`;
            }
            if (stars2Ref.current) { // Middle
                stars2Ref.current.style.transform = `translateY(-${scrollY * 0.3}px)`;
            }
            if (stars3Ref.current) { // Closest
                stars3Ref.current.style.transform = `translateY(-${scrollY * 0.5}px)`;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <style>
                {`
                .bg-animation {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: -10;
                    background: #000;
                    overflow: hidden;
                }

                .stars {
                    position: absolute;
                    top: -50%; /* Position higher to allow parallax scrolling without gaps */
                    left: 0;
                    width: 100%;
                    height: 200%;
                    background-image: 
                        radial-gradient(1px 1px at 20px 30px, #eee, rgba(0,0,0,0)),
                        radial-gradient(1px 1px at 40px 70px, #fff, rgba(0,0,0,0)),
                        radial-gradient(1px 1px at 50px 160px, #ddd, rgba(0,0,0,0)),
                        radial-gradient(1px 1px at 90px 40px, #fff, rgba(0,0,0,0)),
                        radial-gradient(2px 2px at 130px 80px, #fff, rgba(0,0,0,0)),
                        radial-gradient(1px 1px at 160px 120px, #ddd, rgba(0,0,0,0));
                    background-repeat: repeat;
                    background-size: 200px 200px;
                    opacity: 0.6;
                    will-change: transform;
                }

                .stars:nth-of-type(2) {
                    background-size: 300px 300px;
                    opacity: 0.8;
                }

                .stars:nth-of-type(3) {
                    background-size: 500px 500px;
                    opacity: 1;
                }
                `}
            </style>
            <div className="bg-animation">
                <div ref={stars1Ref} className="stars"></div>
                <div ref={stars2Ref} className="stars"></div>
                <div ref={stars3Ref} className="stars"></div>
            </div>
        </>
    );
};
