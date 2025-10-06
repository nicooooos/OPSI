import React, { useEffect, useRef } from 'react';

export const StarryBackground: React.FC = () => {
    // Refs for the containers that will be moved for the parallax effect
    const parallaxLayer1Ref = useRef<HTMLDivElement>(null);
    const parallaxLayer2Ref = useRef<HTMLDivElement>(null);
    const parallaxLayer3Ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            // The transform moves the layers *up* (negative Y) as the page scrolls down.
            // Farther layers (dimmer, smaller patterns) move slower (smaller multiplier).
            if (parallaxLayer1Ref.current) { // Farthest
                parallaxLayer1Ref.current.style.transform = `translateY(-${scrollY * 0.15}px)`;
            }
            if (parallaxLayer2Ref.current) { // Middle
                parallaxLayer2Ref.current.style.transform = `translateY(-${scrollY * 0.3}px)`;
            }
            if (parallaxLayer3Ref.current) { // Closest
                parallaxLayer3Ref.current.style.transform = `translateY(-${scrollY * 0.5}px)`;
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

                .parallax-layer {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    will-change: transform;
                }

                .stars-animated-bg {
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background-image: 
                        radial-gradient(1px 1px at 20px 30px, #eee, rgba(0,0,0,0)),
                        radial-gradient(1px 1px at 40px 70px, #fff, rgba(0,0,0,0)),
                        radial-gradient(1px 1px at 50px 160px, #ddd, rgba(0,0,0,0)),
                        radial-gradient(1px 1px at 90px 40px, #fff, rgba(0,0,0,0)),
                        radial-gradient(2px 2px at 130px 80px, #fff, rgba(0,0,0,0)),
                        radial-gradient(1px 1px at 160px 120px, #ddd, rgba(0,0,0,0));
                    background-repeat: repeat;
                }

                @keyframes drift-1 {
                    from { transform: translate(0, 0); }
                    to { transform: translate(100px, -50px); }
                }
                
                @keyframes drift-2 {
                    from { transform: translate(0, 0); }
                    to { transform: translate(-150px, 80px); }
                }

                @keyframes drift-3 {
                    from { transform: translate(0, 0); }
                    to { transform: translate(50px, 120px); }
                }

                @keyframes twinkle {
                    0%, 100% { opacity: 0.2; }
                    50% { opacity: 0.8; }
                }
                
                .stars-layer-1 {
                    background-size: 200px 200px;
                    opacity: 0.6;
                    animation: drift-1 150s linear infinite alternate;
                }

                .stars-layer-2 {
                    background-size: 300px 300px;
                    opacity: 0.8;
                    animation: drift-2 120s linear infinite alternate;
                }

                .stars-layer-3 {
                    background-size: 500px 500px;
                    opacity: 1;
                    animation: drift-3 90s linear infinite alternate;
                }
                
                /* Add pseudo elements for twinkling stars */
                .stars-animated-bg::after {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-repeat: repeat;
                }

                .stars-layer-1::after {
                    background-image: radial-gradient(1px 1px at 70px 80px, #fff, rgba(0,0,0,0));
                    background-size: 200px 200px;
                    animation: twinkle 11s linear infinite alternate;
                    animation-delay: 2.3s;
                }

                .stars-layer-2::after {
                    background-image: radial-gradient(1px 1px at 10px 100px, #fff, rgba(0,0,0,0)), radial-gradient(2px 2px at 150px 200px, #fff, rgba(0,0,0,0));
                    background-size: 300px 300px;
                    animation: twinkle 8s linear infinite alternate-reverse;
                    animation-delay: 0.7s;
                }

                .stars-layer-3::after {
                    background-image: radial-gradient(2px 2px at 250px 100px, #fff, rgba(0,0,0,0)), radial-gradient(1px 1px at 30px 30px, #ddd, rgba(0,0,0,0));
                    background-size: 500px 500px;
                    animation: twinkle 13s linear infinite alternate;
                    animation-delay: 1.5s;
                }
                `}
            </style>
            <div className="bg-animation">
                {/* Each layer is now wrapped to separate parallax from animation */}
                <div ref={parallaxLayer1Ref} className="parallax-layer">
                    <div className="stars-animated-bg stars-layer-1"></div>
                </div>
                <div ref={parallaxLayer2Ref} className="parallax-layer">
                    <div className="stars-animated-bg stars-layer-2"></div>
                </div>
                <div ref={parallaxLayer3Ref} className="parallax-layer">
                    <div className="stars-animated-bg stars-layer-3"></div>
                </div>
            </div>
        </>
    );
};