import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import CategoryService from "../../service/CategoryService";

const CategoryCrud = () => {
  const [categories, setCategories] = useState([]);
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [categoryData, setCategoryData] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const categoryService = new CategoryService();

  useEffect(() => {
    // Cargar todas las categorías al iniciar
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const data = await categoryService.getAllCategories();
    setCategories(data);
  };

  const openNew = () => {
    setCategoryData(null);
    setSubmitted(false);
    setCategoryDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setCategoryDialog(false);
  };

  const saveCategory = async () => {
    setSubmitted(true);

    if (categoryData.name && categoryData.description) {
      if (categoryData.id) {
        await categoryService.updateCategoryById(
          categoryData.id,
          categoryData.name,
          categoryData.description
        );
      } else {
        await categoryService.createCategory(
          categoryData.name,
          categoryData.description
        );
      }

      hideDialog();
      loadCategories();
    }
  };

  const deleteCategory = async (rowData) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta categoría?")) {
      await categoryService.deleteCategoryById(rowData.id);
      loadCategories();
    }
  };
  const createdBodyTemplate = (rowData) => {
   
    return new Date(rowData.created_at).toLocaleDateString()
};

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success p-mr-2"
          onClick={() => editCategory(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          onClick={() => deleteCategory(rowData)}
        />
      </React.Fragment>
    );
  };

  const editCategory = (category) => {
    setCategoryData({ ...category });
    setCategoryDialog(true);
  };

  return (
    <div>
      <div className="card">
        <Button
          label="Nueva Categoría"
          icon="pi pi-plus"
          className="p-button-success p-mb-3"
          onClick={openNew}
        />

        <DataTable
          value={categories}
          dataKey="id"
          rows={10}
          paginator
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} categorías"
          emptyMessage="No hay categorías encontradas"
        >
          <Column field="name" header="Nombre" sortable />
          <Column field="description" header="Descripción" sortable />
        <Column header="Fecha de Creación" body={createdBodyTemplate} />

          <Column
            body={actionBodyTemplate}
            header="Acciones"
            style={{ textAlign: "center", width: "8rem" }}
          />
        </DataTable>
      </div>

      <Dialog
        visible={categoryDialog}
        style={{ width: "450px" }}
        header="Detalles de la Categoría"
        modal
        className="p-fluid"
        onHide={hideDialog}
      >
        <div className="p-field">
          <label htmlFor="name">Nombre</label>
          <InputText
            id="name"
            value={categoryData?.name || ""}
            onChange={(e) =>
              setCategoryData({ ...categoryData, name: e.target.value })
            }
            autoFocus
            className={submitted && !categoryData?.name ? "p-invalid" : ""}
          />
          {submitted && !categoryData?.name && (
            <small className="p-error">El nombre es requerido.</small>
          )}
        </div>
        <div className="p-field">
          <label htmlFor="description">Descripción</label>
          <InputText
            id="description"
            value={categoryData?.description || ""}
            onChange={(e) =>
              setCategoryData({ ...categoryData, description: e.target.value })
            }
            className={submitted && !categoryData?.description ? "p-invalid" : ""}
          />
          {submitted && !categoryData?.description && (
            <small className="p-error">La descripción es requerida.</small>
          )}
        </div>

        <Button
          label="Guardar"
          icon="pi pi-check"
          onClick={saveCategory}
        />
        <Button
          label="Cancelar"
          icon="pi pi-times"
          className="p-button-secondary p-ml-2"
          onClick={hideDialog}
        />
      </Dialog>
    </div>
  );
};

export default CategoryCrud;
