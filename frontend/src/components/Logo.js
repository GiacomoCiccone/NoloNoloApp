import React from 'react'
import {Link} from 'react-router-dom'

import { CarFilled } from '@ant-design/icons';

const Logo = () => {
    return (
        <div className='text-3xl text-base-content'>
            <Link to='/' className='flex items-center tracking-tighter' aria-label="Vai alla pagina principale del sito - NoloNolo plus" >
            <CarFilled style={{color: '#0ed3cf'}} className='sm:mr-2'/><span className='hidden sm:inline'>Nolo<strong>Nolo<sup>+</sup></strong></span><span className='inline sm:hidden'><sup>+</sup></span>
            </Link>
            
        </div>
    )
}

export default Logo
