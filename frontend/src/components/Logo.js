import React from 'react'
import {Link} from 'react-router-dom'

import { CarFilled } from '@ant-design/icons';

const Logo = () => {
    return (
        <div className='text-2xl sm:text-3xl text-base-content'>
            <Link to='/' className='flex items-center tracking-tight' aria-label="Vai alla pagina principale del sito - NoloNolo plus" >
            <CarFilled style={{color: '#0ed3cf'}} className='mr-2'/>  Nolo<strong>Nolo<sup>+</sup></strong>
            </Link>
            
        </div>
    )
}

export default Logo
