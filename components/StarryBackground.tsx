
import React from 'react';

export const StarryBackground: React.FC = () => {
    return (
        <>
            <style>
                {`
                @keyframes move-up {
                    to {
                        transform: translateY(-1000px);
                    }
                }
                
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
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 200%; /* Taller to allow for vertical animation */
                    background-image: 
                        radial-gradient(1px 1px at 20px 30px, #eee, rgba(0,0,0,0)),
                        radial-gradient(1px 1px at 40px 70px, #fff, rgba(0,0,0,0)),
                        radial-gradient(1px 1px at 50px 160px, #ddd, rgba(0,0,0,0)),
                        radial-gradient(1px 1px at 90px 40px, #fff, rgba(0,0,0,0)),
                        radial-gradient(2px 2px at 130px 80px, #fff, rgba(0,0,0,0)),
                        radial-gradient(1px 1px at 160px 120px, #ddd, rgba(0,0,0,0));
                    background-repeat: repeat;
                    background-size: 200px 200px;
                    animation: move-up 120s linear infinite;
                    opacity: 0.6;
                }

                .stars:nth-of-type(2) {
                    background-size: 300px 300px;
                    animation-duration: 180s;
                    animation-delay: -30s;
                    opacity: 0.8;
                }

                .stars:nth-of-type(3) {
                    background-size: 500px 500px;
                    animation-duration: 240s;
                    animation-delay: -60s;
                    opacity: 1;
                }
                `}
            </style>
            <div className="bg-animation">
                <div className="stars"></div>
                <div className="stars"></div>
                <div className="stars"></div>
            </div>
        </>
    );
};
