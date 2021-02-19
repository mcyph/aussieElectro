import ScrollIntoView from "react-scroll-into-view";
import React from "react";

const NavMenuItem = ({ id, name, activeId }) => (

    <ScrollIntoView
        selector={`#section${name}_id_p0`}
        alignToTop={false} >
        <div className={`navItem ${id === activeId ? "navItemActive" : ""} `}> {name} </div>
    </ScrollIntoView>
)

export default NavMenuItem;
