import React from 'react'

const Loading = (props) => {
    return (
        <>
            {props.loading ? (<div
            className="inset-0 flex w-full h-full items-center justify-center duration-300 transition-opacity"
            style={{zIndex: "10", minHeight: "30rem"}}
        >
            <div className="flex-col max-w-xs">
                <img className='w-full h-full object-contain' src="https://acegif.com/wp-content/uploads/loading-87.gif" alt="Immagine caricamento auto"/>
                <div className="mt-3 filter font-mono opacity-50 text-center">
                    Stiamo cercando le tue auto...
                </div>
            </div>
        </div>) : (<>{props.children}</>)}
        </>
    )
}

export default Loading
