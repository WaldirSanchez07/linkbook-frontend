import React, { useState, useEffect } from 'react';
import { Category } from './layouts/HomeElements';
import { Navbar, Sidebar } from './layouts/Nav';
import { getSessionStorage } from '../_helpers/Session';
import { Headers, Sorting, urlAPI } from '../_helpers/Config';
import { HomeContext } from '../_helpers/Context';
import { Button } from '@material-ui/core'
import { SortingCategory, ModalCreateEdit } from './layouts/Modals';
import arrayMove from 'array-move';
import Profile from '../pages/Profile';
import { HomeBanner, SpinnerHome } from './layouts/Elements';

let target;
let ID;
let iniAuxData = { _id: '', name: '', link: '', _category: '' }

const Home = () => {
    const [collection, setCollection] = useState(); //collection data
    const [category, setCategory] = useState(); //category data
    const [marker, setMarker] = useState(); //marker data
    const [auxObject, setAuxObject] = useState({ idCo: '', nameCo: '', idCa: '' });
    const [iconSort, setIconSort] = useState(false);
    const [sortModal, setSortModal] = useState(false);
    const [banner, setBanner] = useState(true); //for show banner
    const [modalCo, setModalCo] = useState(false); //modal collection
    const [modalCa, setModalCa] = useState(false); //modal category
    const [modalMa, setModalMa] = useState(false); //modal marker
    const [editData, setEditData] = useState(iniAuxData); //edit all data
    const [showbar, setShowbar] = useState(false);
    const [profile, setProfile] = useState(false);
    const [loadingCo, setLoadingCo] = useState(true);
    const [loadingCa, setLoadingCa] = useState();

    const showProfile = () => {
        setProfile(true);
        setBanner(false);
        if (target) target.offsetParent.removeAttribute("link-active");
    }

    const onSidebar = (e) => {
        e.preventDefault();
        setShowbar(!showbar);
    }

    const getCollection = async () => {
        const user = getSessionStorage('_u');
        try {
            const res = await fetch(urlAPI + `/collection/${user}`, { method: 'GET', headers: Headers });
            if (!res.ok) throw new Error("error");
            const data = await res.json();
            setCollection(Sorting(data));
            setLoadingCo(false);
        } catch (error) { }
    }

    const handleActiveCollection = (e) => {
        if (target) target.offsetParent.removeAttribute("link-active");
        target = e.target;
        e.target.offsetParent.setAttribute("link-active", "1");
    }

    const getCategory = async (e, val) => {
        setAuxObject({ ...auxObject, idCo: val._id, nameCo: val.name });
        handleActiveCollection(e);
        setLoadingCa(true);
        setProfile(false);
        setBanner(false);
        try {
            const res = await fetch(urlAPI + `/category/${val._id}`, { method: 'GET', headers: Headers });
            if (!res.ok) throw new Error("Error");
            const data = await res.json();
            setCategory(Sorting(data));
            setLoadingCa(false);
        } catch (error) { }
    }

    const getMarker = async (id) => {
        try {
            if (marker[id]) return;
            else handleMarkers(id);
        } catch (error) {
            handleMarkers(id);
        }
    }

    const handleMarkers = async (id) => {
        try {
            const res = await fetch(urlAPI + `/marker/${id}`, { method: 'GET', headers: Headers });
            if (!res.ok) throw new Error("error")
            let data = await res.json();
            setMarker({ ...marker, [id]: Sorting(data) });
        } catch (error) { }
    }

    useEffect(() => { getCollection() }, []);

    const handleSortID = (id) => { ID = id; console.log(ID) }

    const hiddenCategory = async (id, opc) => {
        let copyCategory = [...category];
        copyCategory.map(async (val, idx) => {
            if (val._id === id && opc === 'show') {
                copyCategory[idx].hidden = true;
            } else if (val._id === id && opc === 'hidden') {
                copyCategory[idx].hidden = false;
                try {
                    await fetch(urlAPI + `/category/${id}`, { method: 'PATCH', headers: Headers });
                } catch (error) { }
            }
        })
        setCategory(copyCategory)
    }

    const handleIconSort = () => { setIconSort(!iconSort); }
    const handleSortModal = () => { setSortModal(!sortModal); }

    /** Sorting **/
    const SortCollection = async ({ oldIndex, newIndex }) => {
        if (oldIndex === newIndex) return;
        let dataCopy = [...collection];
        dataCopy = arrayMove(dataCopy, oldIndex, newIndex);
        setCollection(dataCopy);
        let dataIds = await dataCopy.map(t => t._id);
        try {
            const Body = JSON.stringify(dataIds);
            const res = await fetch(urlAPI + `/collection/position/update`, { method: 'PATCH', headers: Headers, body: Body });
            if (!res.ok) throw new Error("Error");
        } catch (error) { }
    }

    const sortingCategory = async ({ oldIndex, newIndex }) => {
        if (oldIndex === newIndex) return;
        let dataCopy = [...category];
        dataCopy = arrayMove(dataCopy, oldIndex, newIndex);
        setCategory(dataCopy);
        let dataIds = await dataCopy.map(t => t._id);
        try {
            const Body = JSON.stringify(dataIds);
            const res = await fetch(urlAPI + `/category/position/update`, { method: 'PATCH', headers: Headers, body: Body });
            if (!res.ok) throw new Error("Error");
        } catch (error) { }
    }

    const sortingMarker = async ({ oldIndex, newIndex }) => {
        if (oldIndex === newIndex) return;
        let dataCopy = [...marker[ID]];
        dataCopy = arrayMove(dataCopy, oldIndex, newIndex);
        setMarker({ ...marker, [ID]: dataCopy });
        let dataIds = await dataCopy.map(t => t._id);
        try {
            const Body = JSON.stringify(dataIds);
            const res = await fetch(urlAPI + `/marker/position/update`, { method: 'PATCH', headers: Headers, body: Body });
            if (!res.ok) throw new Error("error");
        } catch (error) { }
    }

    const onDelete = async (data, label) => {
        if (label === 'collection') {
            setCollection(collection.filter(collection => collection._id !== data._id));
            if (auxObject.idCo === data._id) setBanner(false);
            try {
                await fetch(urlAPI + `/collection/delete/${data._id}`, { method: 'DELETE', headers: Headers });
            } catch (error) { }
        } else if (label === 'category') {
            setCategory(category.filter(category => category._id !== data._id));
            try {
                await fetch(urlAPI + `/category/delete/${data._id}`, { method: 'DELETE', headers: Headers });
            } catch (error) { }
        } else {
            let dataCopy = [...marker[data._category]];
            let newData = dataCopy.filter(m => m._id !== data._id)
            setMarker({ ...marker, [data._category]: newData });
            try {
                await fetch(urlAPI + `/marker/delete/${data._id}`, { method: 'DELETE', headers: Headers });
            } catch (error) { }
        }
    }

    //edit all data
    const onEdit = (data, label) => {
        setEditData(data);
        if (label === 'collection') setModalCo(!modalCo);
        else if (label === 'category') setModalCa(!modalCa);
        else setModalMa(!modalMa);
    }

    //modal collection for edit
    const onModalCo = () => {
        setEditData(iniAuxData);
        setModalCo(!modalCo);
    }
    //modal category for edit
    const onModalCa = () => {
        setEditData(iniAuxData);
        setModalCa(!modalCa);
    }
    //modal marker for edit
    const onModalMa = (id) => {
        setAuxObject({ ...auxObject, idCa: id });
        setEditData(iniAuxData);
        setModalMa(!modalMa);
    }

    const addData = (opc, data) => {
        if (opc === 'collection') {
            setCollection(collection.concat(data));
        } else if (opc === 'category') {
            setCategory(category.concat(data));
        } else {
            try {
                if (marker[auxObject.idCa]) {
                    let copyMa = [...marker[auxObject.idCa]];
                    copyMa.push(data);
                    setMarker({ ...marker, [auxObject.idCa]: copyMa });
                } else {
                    setMarker({ ...marker, [auxObject.idCa]: [data] });
                }
            } catch (error) {
                setMarker({ ...marker, [auxObject.idCa]: [data] });
            }
        }
    }

    const updateData = (opc, data) => {
        if (opc === 'collection') {
            let newData = collection;
            newData.forEach(val => {
                if (val._id === data._id) val.name = data.name;
            })
            setCollection(newData);
            setAuxObject({ ...auxObject, name: data.name });
        } else if (opc === 'category') {
            let newData = category;
            newData.forEach(val => {
                if (val._id === data._id) val.name = data.name;
            })
            setCategory(newData);
        } else {
            let newData = marker[data._category];
            newData.forEach(val => {
                if (val._id === data._id) {
                    val.link = data.link;
                    val.name = data.name;
                }
            })
            setMarker({ ...marker, [data._category]: newData });
        }
    }

    const events = {
        handleSortID, handleIconSort, getCategory, iconSort, auxObject, addData, updateData,
        onModalCo, onModalMa, onEdit, onDelete, showProfile, hiddenCategory, getMarker
    }

    const homeEvents = {
        auxObject, handleSortModal, category, onModalCa, marker, sortingMarker, loadingCa
    }

    return (
        <HomeContext.Provider value={events}>
            <main className="main-container">
                <div className="main-content">
                    <aside className="sidebar"></aside>
                    <Sidebar
                        collection={collection}
                        SortEnd={SortCollection}
                        showbar={showbar}
                        onSidebar={onSidebar}
                        loadingCo={loadingCo}
                    />
                    <section className="main">
                        <Navbar onSidebar={onSidebar} />
                        { banner ? <HomeBanner /> :
                            !profile ? <WrapperContainer {...homeEvents} /> : <Profile />
                        }
                    </section>
                </div>
            </main>
            <SortingCategory open={sortModal}
                objData={category}
                handleClose={handleSortModal}
                SortEnd={sortingCategory}
            />
            <ModalCreateEdit label='collection' open={modalCo}
                handleClose={onModalCo}
                title={editData.name ? 'Editar collección' : 'Nueva collección'}
                edit={editData}
            />
            <ModalCreateEdit label='category' open={modalCa}
                handleClose={onModalCa}
                title={editData.name ? 'Editar categoría' : 'Nueva categoría'}
                edit={editData}
            />
            <ModalCreateEdit label='marker' open={modalMa}
                handleClose={onModalMa}
                title={editData.name ? 'Editar Enlace' : 'Nuevo enlace'}
                edit={editData}
            />
        </HomeContext.Provider>
    )
}

//Home header
const WrapperHeader = ({ auxObject, handleSortModal, onModalCa }) => {
    return (
        <div className="wrapper-header">
            <div className="wrapper-title">{auxObject.nameCo}</div>
            <div className="wrapper-options">
                <Button variant="outlined" className="btn-outlined" size="small"
                    onClick={handleSortModal}
                    startIcon={<i className="material-icons">folder_special</i>}
                >
                    Categorias
                </Button>
                <Button variant="outlined" className="btn-outlined" size="small"
                    startIcon={<i className="material-icons">create_new_folder</i>}
                    onClick={onModalCa}
                >
                    Crear
                </Button>
            </div>
        </div>
    )
}


const WrapperContainer = (prop) => {
    const { auxObject, handleSortModal, onModalCa, category,
        marker, sortingMarker, loadingCa } = prop;

    return (
        <div className="wrapper-container">
            {
                auxObject.nameCo &&
                <WrapperHeader auxObject={auxObject} handleSortModal={handleSortModal} onModalCa={onModalCa} />
            }
            <SpinnerHome loadingCa={loadingCa}/>
            <div className="grid-container">
                {loadingCa ? '' :
                    category &&
                    category.map((val, idx) => (
                        <div className="grid-box" key={idx} style={{ order: idx }}>
                            <Category
                                category={val}
                                marker={marker}
                                SortEnd={sortingMarker} />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Home
