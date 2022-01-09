import React from "react";
import { useSelector } from "react-redux";
import Protected from "../Protected";

const ProductScreen = (props) => {

    //redux stuff
    const { authToken } = useSelector(
        (state) => state.user
    );

    return <Protected history={props.history}>
        {authToken && <div>
            </div>}
    </Protected>;
};

export default ProductScreen;
