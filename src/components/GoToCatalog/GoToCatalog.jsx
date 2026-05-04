import { NavLink } from "react-router-dom";
import "./GoToCatalog.css"

function GoToCatalog({text}){
    return(
        <NavLink to={'/catalog'} className="to-cat__btn">{text}</NavLink>
    )
}
export default GoToCatalog