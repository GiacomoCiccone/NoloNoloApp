import React from "react";

const ModifyHandler = (props) => {
    return (
        <div className="flex gap-2 items-center">
            <h2 style={{ margin: "0" }} className="text-xl">
                {props.isModifing === props.type ? props.altTitle : props.title}
            </h2>
            <button
                disabled={props.isModifing && props.isModifing !== props.type}
                aria-label={props.ariaLabel}
                onClick={() => {
                    if (!props.isModifing) props.setIsModifing(props.type);
                    else props.setIsModifing("");
                }}
                type="button"
            >
                <i
                    className={`bi bi-${
                        props.isModifing === props.type
                            ? "x-square text-error"
                            : "pencil-square"
                    }`}
                />
            </button>
        </div>
    );
};

export default ModifyHandler;
