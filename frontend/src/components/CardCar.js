import { Space } from 'antd';
import React from 'react'
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

//componenti
import useWindowSize from '../utils/useWindowSize'

const CardCar = (props) => {

    //hooks
    const location = useLocation();

    //redux stuff
    const {theme} = useSelector((state) => state.userPreferences); //in questo modo stiamo prendendo le informazioni nello stato relative all'user
    const user = useSelector((state) => state.user);
    const { authToken } = user;

    //stato
    const width = useWindowSize()


    return (
        <div tabIndex={0} style={{width: width < 768 ? "100%" : width < 1024 ? "calc(50% - 1rem)" : width < 1536 ? "calc(33.3% - 1.33rem)" : "calc(25% - 1.5rem)"}} className='bg-base-200 shadow hover:bg-base-300 transition-all duration-200 ease-linear rounded-lg py-10 px-4 flex flex-col w-full md:w-1/2 lg:w-1/3 2xl:w-1/4'>
            
            <div className='w-full flex items-center justify-between'>
                <div>
                <p style={{margin: '0'}}>
                    <span  className='font-medium tracking-tighter text-xl' aria-label={props.car.model + "."}>{props.car.model}</span></p>
                <p style={{margin: '0'}}><span className='text-opacity-50 font-medium text-sm text-base-content' aria-label={"Marca: " + props.car.brand + "."}>{props.car.brand}</span></p>
                </div>

                <div>
                    <p style={{margin: '0'}} className='font-light text-sm' aria-label={"tag: " + props.car.tag + "."}>#{props.car.tag}</p>
                </div>
            
            </div>

            <div className='flex gap-4 flex-1 h-full'>

                <div className='mt-10'>
                <Space direction="vertical" size={7}>
                <div className='flex gap-2 items-center'>
                    <img className={`filter ${theme !== "dark" ? "invert-0" : 'invert'}`} width={15} src="https://img.icons8.com/ios-glyphs/30/000000/petrol.png" alt='Tipologia motore'/>
                    <p className='text-sm tracking-tight' aria-label={props.car.isElectric ? "Elettrico." : "Benzina."} style={{margin: '0'}}>{props.car.isElectric ? "Elettrico" : "Benzina"}</p>
                </div>

                

                <div className='flex gap-2 items-center'>
                    <img className={`filter ${theme !== "dark" ? "invert-0" : 'invert'}`} width={15} src="https://img.icons8.com/ios-glyphs/30/000000/car-door.png" alt='Numero porte'/>
                    <p className='text-sm tracking-tight' aria-label={"Numero porte: " + props.car.hasThreeDoors ? "3." : "5."} style={{margin: '0'}}>{props.car.hasThreeDoors ? "3" : "5"}</p>
                </div>

                <div className='flex gap-2 items-center'>
                    <img className={`filter ${theme !== "dark" ? "invert-0" : 'invert'}`} width={15} src="https://www.noleggiare.it/wp-content/themes/noleggiare/img/ico-trasmissione.svg" alt='Tipologia cambio'/>
                    <p className='text-sm tracking-tight' aria-label={props.car.hasAutomaticTransmission ? "Automatico." : "Manuale."} style={{margin: '0'}}>{props.car.hasAutomaticTransmission ? "Automatico" : "Manuale"}</p>
                </div>

                <div className='flex gap-2 items-center'>
                    <img className={`filter ${theme !== "dark" ? "invert-0" : 'invert'}`} width={15} src="https://img.icons8.com/ios-filled/50/000000/car-seat.png" alt='Numero sedili'/>
                    <p className='text-sm tracking-tight' aria-label={props.car.seats + "."} style={{margin: '0'}}>{props.car.seats}</p>
                </div>
                
                <div className='flex gap-2 items-center'>
                    <img className={`filter ${theme !== "dark" ? "invert-0" : 'invert'}`} width={15} src="https://img.icons8.com/external-kiranshastry-solid-kiranshastry/64/000000/external-suitcase-interface-kiranshastry-solid-kiranshastry-1.png" alt='Valigie trasportabili'/>
                    <p className='text-sm tracking-tight' aria-label={props.car.baggageSize + "."} style={{margin: '0'}}>{props.car.baggageSize}</p>
                </div>

                </Space>
                </div>
                

                <div className='flex-1 h-52'>
                    <img className='w-full h-full object-contain' src={props.car.image} alt={"Immagine del modello " +  props.car.model + "."} />
                </div>
            </div>

            <div className='w-full flex justify-between gap-2 items-end'>
                <div className='flex-1'>
                 <p aria-label={'A partire da' + props.car.basePrice + "euro all'ora."} style={{margin: '0'}}><span className='text-xs'>a partire da </span><span className='font-bold text-2xl'>{props.car.basePrice}€</span><span>/ ora</span></p>
                </div>
                {authToken && <div className='w-1/2'>
                    <Link to={`/product/${props.car.model}${location.search}`} aria-label={`Clicca per andare alla pagina noleggio dell'auto ${props.car.model}.`}>
                    <button style={{color: '#fff'}} className='btn btn-primary btn-block' type='button'>Scopri</button>
                    </Link>
                 
                </div>}

                <div>


                </div>
            </div>
            
        </div>
    )
}

export default CardCar
