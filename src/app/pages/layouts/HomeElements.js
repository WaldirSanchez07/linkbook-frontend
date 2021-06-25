import React, { useContext } from 'react';
import {
    makeStyles, IconButton, Tooltip, withStyles, Accordion, Typography, FormControlLabel, AccordionDetails,
    Button,
} from '@material-ui/core';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import { HomeContext } from "../../_helpers/Context";
import { SortableList } from './Sortable';

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
    heading: {
        fontWeight: theme.typography.fontWeightRegular,
        marginRight: 'auto',
        width: '99%',
        display: '-webkit-box',
        '-webkit-box-orient': 'vertical',
        '-webkit-line-clamp': 1,
        overflow: 'hidden',
        marginBlockStart: 0,
        marginBlockEnd: 0,
        padding: '5px 0',
        color: '#657786',
    },
    padding: {
        padding: '0 10px'
    },
    marginNLR: {
        marginLeft: 0,
        marginRight: 0
    },
    paddingDetail: {
        padding: '8px 10px 16px 10px',
        display: 'flex',
        flexDirection: 'column'
    },
    btnMa: {
        marginTop: '10px'
    }
}));

const AccordionSummary = withStyles({
    root: {
        minHeight: 56,
        maxHeight: 56,
        '&$expanded': {
            minHeight: 56,
            maxHeight: 56,
        },
    },
    expandIcon: {
        transition: 'none'
    },
    expanded: {},
})(MuiAccordionSummary);

export const MenuOptions = ({ objData, label }) => {
    const [active, setActive] = React.useState(false);
    const ctx = useContext(HomeContext);

    const handleActive = () => setActive(!active);

    const handleEdit = () => ctx.onEdit(objData, label);

    const handleDelete = () => ctx.onDelete(objData, label);

    return (
        <div className="menu-options">
            {active && <>
                <Tooltip title="Editar">
                    <IconButton aria-label="options" size="small" onClick={(e) => handleEdit()}>
                        <i className="material-icons">edit</i>
                    </IconButton>
                </Tooltip>
                <Tooltip title="Eliminar">
                    <IconButton aria-label="options" size="small" onClick={(e) => handleDelete()}>
                        <i className="material-icons">delete</i>
                    </IconButton>
                </Tooltip></>
            }
            <Tooltip title={active ? 'Cerrar' : 'Menu'}>
                <IconButton aria-label="options" onClick={handleActive} size="small">
                    <i className="material-icons">{active ? 'close' : 'more_vert'}</i>
                </IconButton>
            </Tooltip>
        </div>
    )
}

export const Category = ({ category, marker, SortEnd }) => {
    const classes = useStyles();
    const ctx = useContext(HomeContext);
    const [active, setActive] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        if (isExpanded) {
            ctx.hiddenCategory(panel._id, 'show');
            ctx.getMarker(panel._id);
            setActive(true)
            setTimeout(() => { setActive(false) },2000);
        } else {
            ctx.hiddenCategory(panel._id, 'hidden')
        }
    };

    const createMarker = (category) => {
        ctx.onModalMa(category._id)
    }

    return (
        <Accordion expanded={category.hidden} onChange={handleChange(category)}>
            <AccordionSummary aria-controls="panel1a-content" className={classes.padding}>
                <IconButton aria-label="options" size="small">
                    <i className="material-icons">expand_more</i>
                </IconButton>
                <Typography className={classes.heading}>{category.name}</Typography>
                <FormControlLabel aria-label="Acknowledge" className={classes.marginNLR}
                    onClick={(event) => event.stopPropagation()}
                    onFocus={(event) => event.stopPropagation()}
                    control={<MenuOptions objData={category} label='category' />}
                />
            </AccordionSummary>
            <AccordionDetails className={classes.paddingDetail}>
                {   active ? <SkeletonMarker /> :
                    marker &&
                        marker[category._id] ? <Marker items={marker[category._id]} SortEnd={SortEnd} />
                        : <span className="color">No hay enlaces</span>
                }
                <div className={classes.btnMa}>
                    <Button variant="outlined" size="small" className="btn-outlined"
                        startIcon={<i className="material-icons">add_link</i>}
                        onClick={(e) => createMarker(category)}
                    >
                        Nuevo
                    </Button>
                </div>
            </AccordionDetails>
        </Accordion>
    )
}

const Marker = (props) => {
    const { items, SortEnd } = props;
    return (
        items.length > 0 ? <SortableList items={items} label='marker' onSortEnd={SortEnd} useDragHandle />
            : <span className="color">No hay enlaces</span>
    )
}

export const Skeleton = () => {
    return (
        <ul className="Skeleton">
            <li className="ItemSkeleton"></li>
            <li className="ItemSkeleton"></li>
            <li className="ItemSkeleton"></li>
            <li className="ItemSkeleton"></li>
            <li className="ItemSkeleton"></li>
        </ul>
    )
}

export const SkeletonMarker = () => {
    return (
        <ul className="Skeleton">
            <li className="ItemSkeleton w100"></li>
            <li className="ItemSkeleton w100"></li>
            <li className="ItemSkeleton w100"></li>
        </ul>
    )
}