import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table } from 'antd';
import axios from "axios";

//componenti
import Protected from "../Protected";
import { Link } from "react-router-dom";


const columns = [
    {
        title: 'Modello',
        key: 'model',
        dataIndex: 'model',
        render: car => <div className="flex items-center gap-2">
            <div>
                <p style={{margin: '0'}} className="font-medium">{car.model}</p>
            </div>
            <div style={{maxWidth: '10rem', minWidth: '7rem'}}>
                <img className="w-full h-full object-contain" src={car.image} alt={"Immagine " + car.model + "."} />
            </div>
            
        </div>
      },
    
    {
      title: 'Stato',
      dataIndex: 'state',
      key: 'state',
      render: state => <div className={`badge ${state==="pending" ? " badge-warning" : state==="accepted" ? "badge-success" : state==="concluded" ? "badge-info" : "badge-error"}`}>
          {state==="pending" ? "Pendente" : state==="accepted" ? "Accettato" : state==="concluded" ? "Concluso" : "In ritardo"}
        
    </div> 
    },
    
    {
        title: 'Visualizza',
        key: 'view',
        dataIndex: 'view',
        render: rent => <Link aria-label={`Clicca per visualizzare il noleggio dell'auto ${rent.rentObj.car.model} effettuato il ${new Date (rent.createdAt).toLocaleDateString('it-IT')}`} to={`/rents/${rent._id}`}>
            <span className="underline text-info">Visualizza</span>
        </Link>
    },
    {
        title: 'Data creazione',
        dataIndex: 'date',
        key: 'date',
      },
    {
        title: 'Id ordine',
        dataIndex: 'order_id',
        key: 'order_id',
      },
  ];



const RentsScreen = (props) => {
    //redux stuff
    const { authToken, userInfo } = useSelector((state) => state.user);

    //stato
    const [rents, setRents] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchRents = async () => {
            try {
                setIsLoading(true);
                const config = {
                    headers: {
                      Authorization: `Bearer ${authToken}`,
                    },
                  };
                const {data} = await axios.get(`/api/rents/users/${userInfo._id}`, config)

                const displayData = [];

                data.data.forEach((rent, i) => {
                    displayData.push({
                        key: i,
                        order_id: rent._id,
                        date: new Date(rent.createdAt).toLocaleDateString('it-IT'),
                        state: rent.state,
                        model: rent.rentObj.car,
                        view: rent
                    })
                })

                setIsLoading(false);

                setRents(displayData)
            } catch (error) {
                setIsLoading(false);
            }
        }

        fetchRents()
    }, [authToken, userInfo])
    return (
        <Protected history={props.history}>
            {authToken && (
                <div
                    style={{
                        minHeight: "calc(100vh - 5rem)",
                        backgroundImage:
                            "url(https://images.unsplash.com/photo-1552083974-186346191183?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80)",
                    }}
                    className="flex justify-center bg-cover relative py-20"
                >
                    <div className="absolute w-full h-full top-0 backdrop-blur backdrop-brightness-90"></div>
                    <div className="container mx-auto sm:px-8 lg:px-16 xl:px-20 max-w-4xl z-10">
                                <div>
                                <h1 className="text-center">
                                        <span className="text-2xl sm:text-3xl">
                                            Noleggi di {userInfo.first_name}
                                        </span>
                                    </h1>
                                </div>
                                    <br />
                        <div className="bg-base-200 overflow-hidden shadow-md rounded ">
                            
                        <Table loading={isLoading} pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['5', '10', '15']}} scroll={{x: 500}} style={{width: '100'}} bordered columns={columns} dataSource={rents} />
                        </div>
                    </div>
                </div>
            )}
        </Protected>
    );
};

export default RentsScreen;
