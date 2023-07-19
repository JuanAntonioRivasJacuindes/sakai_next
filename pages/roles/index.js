import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import RoleService from "../../service/RoleService";

const RoleCrudPage = () => {
  const [roles, setRoles] = useState([]);
  const [mostrarDialogo, setMostrarDialogo] = useState(false);
  const [roleIdSeleccionado, setRoleIdSeleccionado] = useState(null);
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    obtenerRoles();
  }, []);

  const obtenerRoles = async () => {
    const servicioRoles = new RoleService();
    const datos = await servicioRoles.getAllRoles();
    setRoles(datos);
  };

  const crearRol = async () => {
    const servicioRoles = new RoleService();
    await servicioRoles.createRole(nombre);
    setMostrarDialogo(false);
    obtenerRoles();
  };

  const editarRol = async () => {
    const servicioRoles = new RoleService();
    await servicioRoles.updateRoleById(roleIdSeleccionado, nombre);
    setMostrarDialogo(false);
    obtenerRoles();
  };

  const eliminarRol = async (id) => {
    const servicioRoles = new RoleService();
    await servicioRoles.deleteRoleById(id);
    obtenerRoles();
  };

  const abrirDialogoCrear = () => {
    setRoleIdSeleccionado(null);
    setNombre("");
    setMostrarDialogo(true);
  };

  const abrirDialogoEditar = (roleId, roleName) => {
    setRoleIdSeleccionado(roleId);
    setNombre(roleName);
    setMostrarDialogo(true);
  };

  const encabezado = (
    <div className="p-d-flex p-ai-center">
      <h2>Lista de Roles</h2>
      <Button label="Crear Rol" icon="pi pi-plus" className="p-ml-auto" onClick={abrirDialogoCrear} />
    </div>
  );

  const templateBotones = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success p-mr-2"
          onClick={() => abrirDialogoEditar(rowData.id, rowData.name)}
        />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => eliminarRol(rowData.id)} />
      </React.Fragment>
    );
  };

  return (
    <div>
      <DataTable value={roles} header={encabezado}>
        <Column field="name" header="Nombre"></Column>
        <Column body={templateBotones}></Column>
      </DataTable>

      <Dialog
        visible={mostrarDialogo}
        onHide={() => setMostrarDialogo(false)}
        header={roleIdSeleccionado ? "Editar Rol" : "Crear Rol"}
        footer={<div>

            <Button label="Cancelar" icon="pi pi-times" onClick={() => setMostrarDialogo(false)} className="p-button-text" />
            <Button
              label={roleIdSeleccionado ? "Guardar" : "Crear"}
              icon="pi pi-check"
              onClick={roleIdSeleccionado ? editarRol : crearRol}
              autoFocus
              />
              </div>
         }
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="nombre">Nombre</label>
            <InputText id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
        </div>

       
     
       
      </Dialog>
    </div>
  );
};

export default RoleCrudPage;
