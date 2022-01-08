import React, { useState } from 'react'
import SearchDialog from './SearchDialog'

const HeroSection = () => {

    const [searchModalOpen, setSearchModalOpen] = useState(false)

    const handleModal = (val) => setSearchModalOpen(val)

    return (
        <div style={{minHeight: '400px', height: '65vh', backgroundImage: 'url(https://images.unsplash.com/photo-1567239334464-95411e8c7c58?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80)'}} className='relative flex justify-center items-center bg-cover bg-center bg-fixed'>
            <div className="absolute w-full h-full bg-base-300 backdrop-blur-sm bg-opacity-20"></div>
            <div className='container px-4 sm:px-12 md:px-24 lg:px-36 mb-40 z-10'>
                <h1 style={{fontSize: 'calc(30px + 2vw)', margin: '0'}} className='tracking-tighter'>Nolo<span className='font-bold'>Nolo<sup>+</sup></span></h1>
                <h2 style={{fontSize: 'calc(18px + 0.7vw)'}} className=' tracking-tighter'>Noleggia <span className='font-bold'>dove vuoi</span> e <span className='font-bold'>quando vuoi</span></h2>

                <div className='relative flex mt-8'>
                    <div className='relative'>
                    <div className=" bg-gradient-to-r from-accent to-primary absolute -inset-1 rounded-lg filter blur"></div>
                <button type="button" aria-label='Apri la finestra per effettuare una ricerca' onClick={() => setSearchModalOpen(true)} className='btn btn-secondary sm:btn-wide z-20 relative'>
                  <span className='text-secondary-content'>Cerca la tua auto</span> 
                </button>
                    </div>
                
                </div>
                
            </div>

            <SearchDialog visible={searchModalOpen} setVisible={handleModal} />
        </div>
    )
}

export default HeroSection
