import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import CategoryService from "../../service/CategoryService";

const CategoryCrudPage = () => {
  const [categorias, setCategorias] = useState([]);
  const [mostrarDialogo, setMostrarDialogo] = useState(false);
  const [categoryIdSeleccionado, setCategoryIdSeleccionado] = useState(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    obtenerCategorias();
  }, []);

  const obtenerCategorias = async () => {
    const servicioCategorias = new CategoryService();
    const datos = await servicioCategorias.getAllCategories();
    setCategorias(datos);
  };

  const crearCategoria = async () => {
    const servicioCategorias = new CategoryService();
    await servicioCategorias.createCategory(nombre, descripcion);
    setMostrarDialogo(false);
    obtenerCategorias();
  };

  const editarCategoria = async () => {
    const servicioCategorias = new CategoryService();
    await servicioCategorias.updateCategoryById(categoryIdSeleccionado, nombre, descripcion);
    setMostrarDialogo(false);
    obtenerCategorias();
  };

  const eliminarCategoria = async (id) => {
    const servicioCategorias = new CategoryService();
    await servicioCategorias.deleteCategoryById(id);
    obtenerCategorias();
  };

  const abrirDialogoCrear = () => {
    setCategoryIdSeleccionado(null);
    setNombre("");
    setDescripcion("");
    setMostrarDialogo(true);
  };

  const abrirDialogoEditar = (categoryId, categoryName, categoryDescription) => {
    setCategoryIdSeleccionado(categoryId);
    setNombre(categoryName);
    setDescripcion(categoryDescription);
    setMostrarDialogo(true);
  };

  const encabezado = (
    <div className="p-d-flex p-ai-center">
      <h2>Lista de Categorías</h2>
      <Button label="Crear Categoría" icon="pi pi-plus" className="p-ml-auto" onClick={abrirDialogoCrear} />
    </div>
  );

  const templateBotones = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success p-mr-2"
          onClick={() => abrirDialogoEditar(rowData.id, rowData.name, rowData.description)}
        />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => eliminarCategoria(rowData.id)} />
      </React.Fragment>
    );
  };

  return (
    <div>
      <DataTable value={categorias} header={encabezado}>
        <Column field="name" header="Nombre"></Column>
        <Column field="description" header="Descripción"></Column>
        <Column body={templateBotones}></Column>
      </DataTable>

      <Dialog
        visible={mostrarDialogo}
        onHide={() => setMostrarDialogo(false)}
        header={categoryIdSeleccionado ? "Editar Categoría" : "Crear Categoría"}
        footer={      <div className="p-dialog-footer">
        <Button label="Cancelar" icon="pi pi-times" onClick={() => setMostrarDialogo(false)} className="p-button-text" />
        <Button
          label={categoryIdSeleccionado ? "Guardar" : "Crear"}
          icon="pi pi-check"
          onClick={categoryIdSeleccionado ? editarCategoria : crearCategoria}
          autoFocus
        />
      </div>}
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="nombre">Nombre</label>
            <InputText id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>

          <div className="p-field">
            <label htmlFor="descripcion">Descripción</label>
            <InputText id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
          </div>
        </div>

  
      </Dialog>
    </div>
  );
};

export default CategoryCrudPage;
