import React from "react";

//componenti
import HeroSection from "../HeroSection";

//media
import simpleSVG from '../../assets/undraw_random_thoughts_re_cob6.svg'
import flexibleSVG from '../../assets/undraw_date_picker_gorr.svg'
import handySVG from '../../assets/undraw_best_place_r685.svg'
import convenientSVG from '../../assets/undraw_savings_re_eq4w.svg'
import { Divider } from "antd";

const HomeScreen = () => {
    return (
        <div>
            <HeroSection />

            <section className="container mx-auto flex flex-col px-8 items-center mt-16">
                <h1 style={{fontSize: 'calc(20px + 1vw)', margin: '0'}} className="text-center">Noleggia auto, come preferisci tu</h1>
                <h2 style={{fontSize: 'calc(14px + 0.7vw)', marginTop: '5px'}} className="text-center">
                    <span className=" text-base-content text-opacity-60">NoloNolo<sup>+</sup> è la scelta ideale di noleggio, che soddisfa ogni tipo di esigenza</span></h2>

                <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full mt-10">
                    
                    <div style={{height: '30rem'}} className="w-full">
                    <div style={{maxWidth: '60%'}} className="h-2/3 mx-auto">
                            <img className="w-full h-full object-contain" src={handySVG} alt="" />
                        </div>
                        <div className="h-1/3 max-w-sm mx-auto">
                            <h3 style={{marginTop: '5px'}} className="text-center text-2xl">Comodo</h3>
                            <p className="text-center">Siamo ovunque ci cerchi. Ritira le auto nei nostri numerosi punti di consegna.</p>
                        </div>
                    </div>

                    <div style={{height: '30rem'}}  className="w-full">
                        <div style={{maxWidth: '60%'}} className="h-2/3 mx-auto">
                            <img className="w-full h-full object-contain" src={flexibleSVG} alt="" />
                        </div>
                        <div className="h-1/3 max-w-sm mx-auto">
                            <h3 style={{marginTop: '5px'}} className="text-center text-2xl">Flessibile</h3>
                            <p className="text-center">Abbiamo due tipologie di noleggio: classico e periodico. Scegli quella che fa al caso tuo.</p>
                        </div>
                    </div>

                    <div style={{height: '30rem'}}  className="w-full">
                    <div style={{maxWidth: '60%'}} className="h-2/3 mx-auto">
                            <img className="w-full h-full object-contain" src={simpleSVG} alt="" />
                        </div>
                        <div className="h-1/3 max-w-sm mx-auto">
                            <h3 style={{marginTop: '5px'}} className="text-center text-2xl">Semplice</h3>
                            <p className="text-center">Basta un account e puoi cercare l'auto nelle date in cui hai bisogno. È semplice, prova!</p>
                        </div>
                    </div>

                    <div style={{height: '30rem'}}  className="w-full">
                    <div style={{maxWidth: '60%'}} className="h-2/3 mx-auto">
                            <img className="w-full h-full object-contain" src={convenientSVG} alt="" />
                        </div>
                        <div className="h-1/3 max-w-sm mx-auto">
                            <h3 style={{marginTop: '5px'}} className="text-center text-2xl">Conveniente</h3>
                            <p className="text-center">Teniamo ai nostri clienti. Per questo NoloNolo<sup>+</sup> offre prezzi vantaggiosi, con sconti fatti su misura per te.</p>
                        </div>
                    </div>

                </div>

                <Divider dashed />
            </section>

            

            <section className="container mx-auto flex flex-col px-8 items-center mt-10">
                <h1 style={{fontSize: 'calc(20px + 1vw)', margin: '0'}} className="text-center">Tipologie di noleggio</h1>
                <h2 style={{fontSize: 'calc(14px + 0.7vw)', marginTop: '5px'}} className="text-center">
                    <span className=" text-base-content text-opacity-60">Scopri le nostre due tipologie di noleggio, e scegli quella che fa per te</span></h2>

                <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full mt-10">
                    
                    <div style={{height: '35rem'}}  className="w-full max-w-sm hover:bg-base-200 py-8 px-4 transition-all duration-200 ease-linear rounded">
                        <div style={{backgroundImage: 'url(https://images.unsplash.com/photo-1635975234590-e8f9bf0b9cf3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80)'}} className="rounded-full w-44 h-44 sm:w-64 sm:h-64 mx-auto bg-center bg-cover shadow-md">
                            
                        </div>
                    <br />
                    <h3 style={{marginTop: '5px'}} className="text-center text-2xl">Classico</h3>
                    <p className="text-center">Il noleggio classico è il noleggio come lo hai sempre pensato. Scegli una data di inizio, una data di fine e vai dove vuoi con la tua auto! Questa tipologia di noleggio è perfetta per imprevisti o viaggi.</p>
                    <p></p>
                    </div>
                

                    <div style={{height: '35rem'}} className="w-full max-w-sm hover:bg-base-200 py-8 px-4 transition-all duration-200 ease-linear rounded">
                        <div style={{backgroundImage: 'url(https://images.unsplash.com/photo-1627454819213-268e2c9abdbe?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=741&q=80)'}} className="rounded-full w-44 h-44 sm:w-64 sm:h-64 mx-auto bg-center bg-cover shadow-md">
                            
                        </div>
                    <br />
                    <h3 style={{marginTop: '5px'}} className="text-center text-2xl">Periodico</h3>
                    <p className="text-center">Il noleggio periodico è proprio ciò che dice il termine. Scegli una data di inizio, una durata e quanti giorni la settimana hai bisogno della tua auto. L'auto sarà tua per tutto il periodo scelto. Questa tipologia di noleggio è perfetta per lavoratori che non vogliono acquistare un'auto.</p>
                    <p></p>
                    </div>

                </div>
            </section>

            <br />
        </div>
    );
};

export default HomeScreen;
