import React, { useEffect } from 'react';

const LoadingComponent = ({classes=''}) => {
    useEffect(() => {
        // When component mounts, set document height to 100vh and hide overflow
        if(!classes){
            document.documentElement.style.height = "100vh";
            document.documentElement.style.overflow = "hidden";
        }
        if(!classes){
            window.scrollTo(0, 0);
        }
        // Cleanup function to reset height and overflow when component unmounts
        return () => {
            document.documentElement.style.height = "";
            document.documentElement.style.overflow = "";
        };
    }, []);

    return (
        <div className='loader-component' style={{zIndex:'1111111111111'}}>
            <div id="loader" className={classes}>
                <span id="loaderGif"></span>
            </div>
        </div>
    );
};

export default LoadingComponent;
