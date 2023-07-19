import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Image } from "primereact/image";
import { Paginator } from "primereact/paginator";
import UserService from "../../service/UserService"


const UserCrudPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarDialogo, setMostrarDialogo] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(5);

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    const servicioUsuarios = new UserService();
    const datos = await servicioUsuarios.getAllUsers();
    setUsuarios(datos);
  };

  const guardarUsuario = async () => {
    const servicioUsuarios = new UserService();
    if (usuarioSeleccionado) {
      await servicioUsuarios.updateUserById(usuarioSeleccionado.id, nombre, email, password, fotoPerfil);
    } else {
      await servicioUsuarios.createUser(nombre, email, password, fotoPerfil);
    }
    setMostrarDialogo(false);
    obtenerUsuarios();
  };

  const eliminarUsuario = async (id) => {
    const servicioUsuarios = new UserService();
    await servicioUsuarios.deleteUserById(id);
    obtenerUsuarios();
  };

  const editarUsuario = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setNombre(usuario.name);
    setEmail(usuario.email);
    setFotoPerfil(usuario.profile_photo_url);
    setPassword("");
    setMostrarDialogo(true);
  };

  const agregarUsuario = () => {
    setUsuarioSeleccionado(null);
    setNombre("");
    setEmail("");
    setFotoPerfil("");
    setPassword("");
    setMostrarDialogo(true);
  };

  const encabezado = (
    <div className="p-d-flex p-ai-center">
      <h2>Lista de Usuarios</h2>
      <div className="p-mb-3">
      <Button label="Agregar Usuario" icon="pi pi-plus" className="p-ml-auto m-10" onClick={agregarUsuario} />
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar Usuarios" />
        </span>
      </div>
    </div>
  );

  const templateBotones = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editarUsuario(rowData)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => eliminarUsuario(rowData.id)} />
      </React.Fragment>
    );
  };

  const templateFotoPerfil = (rowData) => {
    return (
      <Image src={rowData.profile_photo_url} alt={rowData.name} style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
    );
  };

  const buscarUsuario = (usuario) => {
    return (
      usuario.name.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.email.toLowerCase().includes(busqueda.toLowerCase())
    );
  };

  const onPageChange = (event) => {
    setFirst(event.first);
  };

  return (
    <div>
    

      <DataTable value={usuarios.filter(buscarUsuario)} header={encabezado} paginator rows={rows} first={first} onPage={onPageChange}>
        <Column field="name" header="Nombre"></Column>
        <Column field="email" header="Email"></Column>
        <Column body={templateFotoPerfil} header="Foto de Perfil"></Column>
        <Column body={templateBotones}></Column>
      </DataTable>

      <Dialog visible={mostrarDialogo} onHide={() => setMostrarDialogo(false)} header={usuarioSeleccionado ? "Editar Usuario" : "Agregar Usuario"}>
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="nombre">Nombre</label>
            <InputText id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>

          <div className="p-field">
            <label htmlFor="email">Email</label>
            <InputText id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="p-field">
            <label htmlFor="fotoPerfil">URL de la Foto de Perfil</label>
            <InputText id="fotoPerfil" value={fotoPerfil} onChange={(e) => setFotoPerfil(e.target.value)} />
          </div>

          {!usuarioSeleccionado && (
            <div className="p-field">
              <label htmlFor="password">Contraseña</label>
              <InputText id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          )}
        </div>

        <div className="p-dialog-footer">
          <Button label="Cancelar" icon="pi pi-times" onClick={() => setMostrarDialogo(false)} className="p-button-text" />
          <Button label={usuarioSeleccionado ? "Guardar" : "Agregar"} icon="pi pi-check" onClick={guardarUsuario} autoFocus />
        </div>
      </Dialog>

    </div>
  );
};

export default UserCrudPage;
