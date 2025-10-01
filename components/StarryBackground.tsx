
import React from 'react';

// This component creates a pure CSS animated starry background.
export const StarryBackground: React.FC = () => {
    return (
        <>
            <style>
                {`
                @keyframes move-twink-back {
                    from {background-position:0 0;}
                    to {background-position:-10000px 5000px;}
                }
                .stars, .twinkling {
                    position:absolute;
                    top:0;
                    left:0;
                    right:0;
                    bottom:0;
                    width:100%;
                    height:100%;
                    display:block;
                }
                .stars {
                    background:#000 url(https://www.script-tutorials.com/demos/360/images/stars.png) repeat top center;
                    z-index:0;
                }
                .twinkling {
                    background:transparent url(https://www.script-tutorials.com/demos/360/images/twinkling.png) repeat top center;
                    z-index:1;
                    animation:move-twink-back 200s linear infinite;
                }
                `}
            </style>
            <div className="fixed top-0 left-0 w-full h-full -z-10">
                <div className="stars"></div>
                <div className="twinkling"></div>
            </div>
        </>
    );
};
