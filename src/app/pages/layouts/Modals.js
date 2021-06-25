import React,{ useContext } from 'react';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, 
    FormControl, InputLabel, OutlinedInput, FormHelperText } from '@material-ui/core';
import { Tooltip, IconButton, makeStyles } from "@material-ui/core";
import { Headers, urlAPI } from '../../_helpers/Config';
import { HomeContext } from '../../_helpers/Context';
import { getSessionStorage } from '../../_helpers/Session';

const useStyles = makeStyles((theme) => ({
    marginLeft: {
        marginLeft: 'auto',
    },
    paddingTitle: {
        padding: '10px 24px',
        borderBottom: '1px solid #919eab3d'
    },
}));

const DragHandle = sortableHandle(() => {
    const classes = useStyles();
    return (
        <Tooltip title="Mover">
            <IconButton aria-label="drag" size="small" className={classes.marginLeft}>
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

const SortableItem = sortableElement(({ value, label }) => {
    return (
        <li className="sortTableItem zIndex">
            <span className="list-name">{value.name}</span>
            <DragHandle value={value} label={label} />
        </li>
    )
});

export const SortingCategory = ({ open, handleClose, objData, SortEnd }) => {
    const classes = useStyles();
    return (
        <Dialog open={open} aria-labelledby="responsive-dialog-title" fullWidth={true} >
            <DialogTitle id="responsive-dialog-title" className={classes.paddingTitle}>Ordenar Categorías</DialogTitle>
            <DialogContent className="modalContentCa">
                {
                    objData && <SortableList items={objData} label='category' onSortEnd={SortEnd} useDragHandle />
                }
            </DialogContent>
            <DialogActions style={{ padding: '8px 24px' }}>
                <Button type="reset" color="primary" style={{ fontSize: '13px' }} variant="outlined" onClick={handleClose}>
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export const ModalCreateEdit = (props) => {
    const { open, handleClose, label, title, edit } = props;
    const [formCo, setFormCo] = React.useState({ name: '' }); //collection
    const [formCa, setFormCa] = React.useState({ name: '' }); //category
    const [formMa, setFormMa] = React.useState({ name: '', link: '' }); //marker
    const [errors, setErrors] = React.useState({ name: '', link: '' });
    const ctx = useContext(HomeContext);
    const btn = document.getElementsByClassName('smt');
    const user = getSessionStorage('_u');

    React.useEffect(() => {
        if (label === 'collection') setFormCo(edit);
        else if (label === 'category') setFormCa(edit);
        else setFormMa(edit)
    }, [edit, label]);

    //set data in forms
    const setCollection = (prop) => (e) => {
        setFormCo({ ...formCo, [prop]: e.target.value })
    }
    const setCategory = (prop) => (e) => {
        setFormCa({ ...formCa, [prop]: e.target.value })
    }
    const setMarker = (prop) => (e) => {
        setFormMa({ ...formMa, [prop]: e.target.value })
    }

    //request POST to server
    const saveData = (opc) => async (e) => {
        e.preventDefault();
        btn[0].classList.add('btn-loading');
        errors.name = '';
        errors.link = '';
        if (opc === 'collection') await handleCreateCollection();
        else if (opc === 'category') await handleCreateCategory();
        else await handleCreateMarker();
        btn[0].classList.remove('btn-loading');
    }

    const handleCreateCollection = async () => {
        try {
            Headers['x-access-token'] = getSessionStorage('_t');
            const Body = JSON.stringify({ name: formCo.name, _user: user });
            const res = await fetch(urlAPI + `/collection/create`, { method: 'POST', headers: Headers, body: Body });
            if (!res.ok) {
                const error = await res.json();
                if (error.errors) {
                    const er = await handleErrors(error.errors);
                    setErrors(er);
                    return;
                } else { throw new Error("error!"); }
            }
            let data = await res.json();
            ctx.addData('collection', data);
            handleReset();
        } catch (err) { }
    }

    const handleCreateCategory = async () => {
        try {
            Headers['x-access-token'] = getSessionStorage('_t');
            const Body = JSON.stringify({ name: formCa.name, _collection: ctx.auxObject.idCo });
            const res = await fetch(urlAPI + `/category/create`, { method: 'POST', headers: Headers, body: Body });
            if (!res.ok) {
                const error = await res.json();
                if (error.errors) {
                    const er = await handleErrors(error.errors);
                    setErrors(er);
                    return;
                } else { throw new Error("error!"); }
            }
            let data = await res.json();
            ctx.addData('category', data);
            handleReset();
        } catch (err) {

        }
    }

    const handleCreateMarker = async () => {
        try {
            Headers['x-access-token'] = getSessionStorage('_t');
            const Body = JSON.stringify({ name: formMa.name, link: formMa.link, _category: ctx.auxObject.idCa });
            const res = await fetch(urlAPI + `/marker/create`, { method: 'POST', headers: Headers, body: Body });
            if (!res.ok) {
                const error = await res.json();
                if (error.errors) {
                    const er = await handleErrors(error.errors);
                    setErrors(er);
                    return;
                } else { throw new Error("error!"); }
            }
            let data = await res.json();
            ctx.addData('marker', data);
            handleReset();
        } catch (err) { }
    }

    //request PATCH to server
    const editData = (opc) => async (e) => {
        e.preventDefault();
        btn[0].classList.add('btn-loading');
        errors.name = '';
        errors.link = '';
        if (opc === 'collection') await handleEditCollection();
        else if (opc === 'category') await handleEditCategory();
        else await handleEditMarker();
        btn[0].classList.remove('btn-loading');
    }

    const handleEditCollection = async () => {
        try {
            Headers['x-access-token'] = getSessionStorage('_t');
            const Body = JSON.stringify({ name: formCo.name, _user: user });
            const res = await fetch(urlAPI + `/collection/update/${formCo._id}`, { method: 'PATCH', headers: Headers, body: Body });
            if (!res.ok) {
                const error = await res.json();
                if (error.errors) {
                    const er = await handleErrors(error.errors);
                    setErrors(er);
                    return;
                } else { throw new Error("error!"); }
            }
            ctx.updateData('collection', formCo);
            handleReset();
        } catch (err) {
        }
    }

    const handleEditCategory = async () => {
        try {
            Headers['x-access-token'] = getSessionStorage('_t');
            const Body = JSON.stringify({ name: formCa.name, _collection: ctx.auxObject.idCo });
            const res = await fetch(urlAPI + `/category/update/${formCa._id}`, { method: 'PATCH', headers: Headers, body: Body });
            if (!res.ok) {
                const error = await res.json();
                if (error.errors) {
                    const er = await handleErrors(error.errors);
                    setErrors(er);
                    return;
                } else { throw new Error("error!"); }
            }
            ctx.updateData('category', formCa);
            handleReset();
        } catch (err) {
        }
    }

    const handleEditMarker = async () => {
        try {
            Headers['x-access-token'] = getSessionStorage('_t');
            const Body = JSON.stringify({ name: formMa.name, link: formMa.link, _category: ctx.auxObject.idCa });
            const res = await fetch(urlAPI + `/marker/update/${formMa._id}`, { method: 'PATCH', headers: Headers, body: Body });
            if (!res.ok) {
                const error = await res.json();
                if (error.errors) {
                    const er = await handleErrors(error.errors);
                    setErrors(er);
                    return;
                } else { throw new Error("error!"); }
            }
            ctx.updateData('marker', formMa);
            handleReset();
        } catch (err) {
        }
    }

    const handleErrors = (err) => {
        let Errors = { name: '', link: '' }
        Object.keys(err).forEach(key => {
            Errors[key] = err[key];
        });
        return Errors;
    }

    const iniForms = () => {
        setFormCo({ name: '' });
        setFormCa({ name: '' });
        setFormMa({ name: '', link: '' });
    }

    const handleReset = () => {
        iniForms();
        setErrors({ name: '', link: '' });
        handleClose();
    }

    return (
        <Dialog open={open} aria-labelledby="responsive-dialog-title" fullWidth={true} >
            <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
            <form onSubmit={edit.name ? editData(label) : saveData(label)}>
                <DialogContent className="modal-content">
                    {
                        label === 'collection' ?
                            <Collection handleChange={setCollection} errors={errors} edit={formCo} />
                            : label === 'category' ?
                                <Category handleChange={setCategory} errors={errors} edit={formCa} />
                                : <Marker handleChange={setMarker} errors={errors} edit={formMa} />
                    }
                </DialogContent>
                <DialogActions style={{ padding: '8px 24px' }}>
                    <Button onClick={handleReset} color="default" style={{ textTransform: 'none' }} variant="contained">
                        Cerrar
                    </Button>
                    <Button style={{ background: 'var(--bg-green)', textTransform: 'none' }} variant="contained" type="submit" className="smt">
                        {edit.name ? 'Actualizar' : 'crear'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

const Collection = ({ handleChange, errors, edit }) => {
    return (
        <FormControl className="Mui-input-outlined" variant="outlined" error={errors.name ? true : false}>
            <InputLabel htmlFor="name-collection">Nombre</InputLabel>
            <OutlinedInput id="name-collection" type="text" labelWidth={70}
                value={edit && edit.name}
                onChange={handleChange('name')}
            />
            {errors.name && <FormHelperText id="name-error">{errors.name}</FormHelperText>}
        </FormControl>
    )
}

const Category = ({ handleChange, errors, edit }) => {
    return (
        <FormControl className="Mui-input-outlined" variant="outlined" error={errors.name ? true : false}>
            <InputLabel htmlFor="name-category">Nombre</InputLabel>
            <OutlinedInput id="name-category" type="text" labelWidth={70}
                value={edit && edit.name}
                onChange={handleChange('name')}
            />
            {errors.name && <FormHelperText id="name-error">{errors.name}</FormHelperText>}
        </FormControl>
    )
}

const Marker = ({ handleChange, errors, edit }) => {
    return (
        <>
            <FormControl className="Mui-input-outlined mg" variant="outlined" error={errors.link ? true : false}>
                <InputLabel htmlFor="link-marker">Link</InputLabel>
                <OutlinedInput id="link-marker" type="text" labelWidth={70}
                    value={edit && edit.link}
                    onChange={handleChange('link')}
                />
                {errors.link && <FormHelperText id="name-error">{errors.link}</FormHelperText>}
            </FormControl>
            <FormControl className="Mui-input-outlined mg" variant="outlined" error={errors.name ? true : false}>
                <InputLabel htmlFor="name-marker">Nombre</InputLabel>
                <OutlinedInput id="name-marker" type="text" labelWidth={70}
                    value={edit && edit.name}
                    onChange={handleChange('name')}
                />
                {errors.name && <FormHelperText id="name-error">{errors.name}</FormHelperText>}
            </FormControl>
        </>
    )
}
