// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

// //react hook form
// import { useForm } from "react-hook-form";

// //antd
// import {  Spin, message } from "antd";

// //redux
// import { useDispatch, useSelector } from "react-redux";

const RegisterScreen = (props) => {
    // //useform stuff
    // const {
    //     register,
    //     handleSubmit,
    //     formState: { errors },
    // } = useForm();

    // //redux stuff
    // const user = useSelector((state) => state.user);
    // const { error, isLoading, authToken } = user;
    // const dispatch = useDispatch();

    // //stato
    // const [passwordVisible, setPasswordVisible] = useState(false);

    // //form
    // const onSubmit = (data) => {
    //     console.log(data);
    // };

    // useEffect(() => {
    //     error &&
    //         message.error({
    //             content: <span role="alert">{error}</span>,
    //             duration: 5,
    //         });
    //     error &&
    //         dispatch({
    //             type: "RESET_ERROR_USER",
    //         });
    // }, [error]);
    
    // useEffect(() => {
    //     authToken && props.history.push("/");
    // }, [props.history, authToken])

    // return (
    //     <div
    //         style={{ minHeight: "640px", height: "calc(100vh - 5rem)" }}
    //         className="flex"
    //     >
    //         {/* Immagine */}
    //         <div className="w-1/2 hidden md:block h-full order-2">
    //             <img
    //                 className=" w-full h-full object-cover"
    //                 src="https://images.unsplash.com/photo-1573483215769-4d4acea52a1c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
    //                 alt=""
    //             />
    //         </div>

    //         <div
    //             style={{ padding: "0% 4%" }}
    //             className="w-full md:w-1/2 flex flex-col order-1"
    //         >
    //             <span className="mt-16"></span>
    //             <h2 className="text-4xl text-center">
    //                 <span>Iscriviti, è veloce</span>
    //             </h2>

    //             <form
    //                 onSubmit={handleSubmit(onSubmit)}
    //                 className=" w-full max-w-md bg-base-300 rounded-md shadow-md relative left-1/2 -translate-x-1/2 overflow-hidden"
    //             >
    //                 <Spin spinning={isLoading}>
    //                     <div className="p-5">
    //                         {/* Ripristina password */}

    //                         <div className="w-full flex items-center justify-center mt-4">
    //                             <Link
    //                                 aria-label="Vai alla pagina di login se hai già un account."
    //                                 to="/login"
    //                                 className="text-sm text-center"
    //                             >
    //                                 <span className="underline">
    //                                     Hai già un account? Accedi
    //                                 </span>
    //                             </Link>
    //                         </div>
    //                     </div>
    //                 </Spin>
    //             </form>
    //         </div>
    //     </div>
    // );

    return (
<></>
    );
};

export default RegisterScreen;
