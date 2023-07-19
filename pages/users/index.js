import React, { useState, useEffect,useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import UserService from "../../service/UserService";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDialogVisible, setUserDialogVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const userService = new UserService();
  if (typeof window !== 'undefined') {
    
  }
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const userList = await userService.getAllUsers();
      
      setUsers(userList);
    } catch (error) {
      console.error(error);
    }
  };

  const saveUser = async () => {
    setLoading(true);
    try {
      if (selectedUser) {
        await userService.updateUserById(selectedUser.id, name, email, password);
        showToast("success", "Usuario Actualizado");
      } else {
        await userService.createUser(name, email, password);
        showToast("success", "Usuario Creado");
      }
      setLoading(false);
      hideDialog();
      loadUsers();
    } catch (error) {
      console.error(error);
      showToast("error", "Ocurrió un error");
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    setLoading(true);
    try {
      await userService.deleteUserById(userId);
      showToast("success", "Usuario Eliminado");
      setLoading(false);
      loadUsers();
    } catch (error) {
      console.error(error);
      showToast("error", "Ocurrió un error");
      setLoading(false);
    }
  };

  const showToast = (severity, summary) => {
    toast.current.show({ severity: severity, summary: summary });
  };

  const showDialog = (user) => {
    setSelectedUser(user);
    setUserDialogVisible(true);
    setName(user?.name || "");
    setEmail(user?.email || "");
    setPassword(user?.password || "");
  };

  const hideDialog = () => {
    setSelectedUser(null);
    setUserDialogVisible(false);
    setName("");
    setEmail("");
    setPassword("");
  };

  const renderHeader = () => {
    return (
      <div className="p-d-flex p-ai-center">
        <h2 className="p-mr-2">Lista de Usuarios</h2>
        <Button label="Crear Usuario" icon="pi pi-plus" onClick={() => showDialog(null)} />
      </div>
    );
  };

  const renderUserDialog = () => {
    return (
      <Dialog visible={userDialogVisible} onHide={hideDialog} header={selectedUser ? "Editar Usuario" : "Crear Usuario"} modal className="p-fluid" footer={renderUserDialogFooter()}>
        <div className="p-field">

          <label htmlFor="name">Nombre</label>
          <InputText id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="p-field">
          <label htmlFor="email">Email</label>
          <InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="p-field">
          <label htmlFor="password">Contraseña</label>
          <InputText id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
      </Dialog>
    );
  };

  const renderUserDialogFooter = () => {
    return (
      <div>
        <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} disabled={loading} />
        <Button label={selectedUser ? "Actualizar" : "Guardar"} icon="pi pi-check" onClick={saveUser} autoFocus disabled={loading} />
      </div>
    );
  };

  const renderActionButtons = (rowData) => {
    return (
      <div>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => showDialog(rowData)} disabled={loading} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => deleteUser(rowData.id)} disabled={loading} />
      </div>
    );
  };
  const imageBodyTemplate = (rowData) => {
 
    return <img src={rowData.profile_photo_url} alt="Foto de perfil" className="w-4rem shadow-2 border-round" />;
};
  const createdBodyTemplate = (rowData) => {
   
    return new Date(rowData.created_at).toLocaleDateString()
};

  const renderDataTable = () => {
    return (
      <DataTable value={users} header={renderHeader()}>
        <Column header="Foto" body={imageBodyTemplate}/>
        <Column field="name" header="Nombre" />
        <Column field="email" header="Email" />
        <Column header="Fecha de Creación" body={createdBodyTemplate} />
        <Column body={renderActionButtons} />
      </DataTable>
    );
  };

  const toast = useRef(null);

  return (
    <div>
      <Toast ref={toast} />
      {renderDataTable()}
      {renderUserDialog()}
    </div>
  );
};

export default UserList;
