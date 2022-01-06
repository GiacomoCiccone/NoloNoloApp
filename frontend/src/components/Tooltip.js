import React from 'react'
import { Tooltip as AntdTooltip } from 'antd'

const Tooltip = (props) => {
    return (
         <span>
         <AntdTooltip
             trigger={["focus", "hover"]}
             color={props.color}
             title={props.title}
         >
             <span
             tabIndex={0}
             aria-label={props.title}>
                 {" "}
                 <i className={`bi ${props.icon} ml-2 text-${props.type}`} />
             </span>
         </AntdTooltip>
     </span>
    )
}

export default Tooltip
