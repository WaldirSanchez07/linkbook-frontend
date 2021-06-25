import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import { HomeContext } from "../../_helpers/Context";
import { MenuOptions } from './HomeElements';
import { Tooltip, IconButton, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    marginLeft: {
        marginLeft: 'auto',
    },
}));

const DragHandle = sortableHandle(({value, label}) => {
    const classes = useStyles();
    const ctx = useContext(HomeContext);

    const sortID = () => {
        if (value)  ctx.handleSortID(value._category);
    }

    return (
        <Tooltip title="Mover">
            <IconButton aria-label="drag" size="small" 
            onPointerDown={(e) => sortID()} 
            className={classes.marginLeft}>
                <i className="material-icons-round">drag_handle</i>
            </IconButton>
        </Tooltip>
    )
});

const SortableList = sortableContainer(({ items, label }) => {
    return (
        <ul className="sortTable">
            {
                items.map((item, i) => <SortableItem key={i} value={item} label={label} index={i} />)
            }
        </ul>
    )
});

const Enlace = ({ value }) => {
    return (
        <>
            <div className="favicon-container">
                <img src={`http://www.google.com/s2/favicons?domain=${value.link}`} alt="icon" className="favicon" />
            </div>
            <Link to={{ pathname: value.link }} target="_blank">{value.name}</Link>
        </>
    )
}

const SortableItem = sortableElement(({ value, label }) => {
    return (
        <li className="sortTableItem">
            <Enlace label={label} value={value} />
            <DragHandle value={value} label={label}/>
            <MenuOptions objData={value} label={label} />
        </li>
    )
});

export {
    SortableList
}