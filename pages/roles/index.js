import React, { useState, useEffect ,useRef} from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import RoleService from '../../service/RoleService';


const MyComponent = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [name, setName] = useState('');

  const roleService = new RoleService();
  const toast = useRef(null);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = () => {
    roleService.getAllRoles()
      .then(data => setRoles(data))
      .catch(error => console.error(error));
  };

  const createRole = () => {
    roleService.createRole(name)
      .then(() => {
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Rol creado' });
        loadRoles();
        hideDialog();
      })
      .catch(error => console.error(error));
  };

  const updateRole = () => {
    roleService.updateRoleById(selectedRole.id, name)
      .then(() => {
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Rol actualizado' });
        loadRoles();
        hideDialog();
      })
      .catch(error => console.error(error));
  };

  const deleteRole = (data) => {
   
      roleService.deleteRoleById(data.id)
        .then(() => {
          toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Rol eliminado' });
          loadRoles();
          hideDialog();
        })
        .catch(error => console.error(error));
  
  };

  const showDialog = (role) => {
    setSelectedRole(role);
    setName(role ? role.name : '');
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setSelectedRole(null);
    setName('');
    setDialogVisible(false);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const actionTemplate = (rowData) => {
    console.log(rowData)
    if(rowData.name==="Administrator"){
        return(
            <div></div>
        )
    }
    return (
        
      <React.Fragment>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => showDialog(rowData)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => deleteRole(rowData)} />
      </React.Fragment>
    );
  };

  return (
    <div>
      <Button label="Nuevo Rol" icon="pi pi-plus" className="p-button-rounded p-button-success p-mb-3" onClick={() => showDialog(null)} />

      <DataTable value={roles}>
        <Column field="name" header="Nombre"></Column>
        <Column header="Acciones" body={actionTemplate}></Column>
      </DataTable>

      <Dialog visible={dialogVisible} onHide={hideDialog} header={selectedRole ? 'Editar Rol' : 'Crear Rol'}>
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="name">Nombre</label>
            <InputText id="name" value={name} onChange={handleNameChange} />
          </div>
        </div>

        <div className="p-dialog-footer">
          <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
          <Button label={selectedRole ? 'Actualizar' : 'Crear'} icon="pi pi-check" className="p-button-text" onClick={selectedRole ? updateRole : createRole} />
        </div>
      </Dialog>

      <Toast ref={toast} />
    </div>
  );
};

export default MyComponent;
