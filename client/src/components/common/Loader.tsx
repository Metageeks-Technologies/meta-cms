import React from 'react'

const Loader = () => {
    return (
        <div className='w-[99vw] h-screen fixed top-0 flex items-center justify-center bg-black/50 z-30'>
            <div className="relative w-10 h-10 transform rotate-[165deg] -mt-20">
                <div
                    className="absolute top-1/2 left-1/2 block w-2 h-2 translate-x-[-50%] translate-y-[-50%] rounded-[0.125em] animate-before8"
                ></div>
                <div
                    className="absolute top-1/2 left-1/2 block w-2 h-2 translate-x-[-50%] translate-y-[-50%] rounded-[0.125em] animate-after6"
                ></div>
            </div>

        </div>
    )
}

export default Loader