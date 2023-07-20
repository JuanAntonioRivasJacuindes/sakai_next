import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";
import ProductService from "../../service/ProductService";
import CategoryService from "../../service/CategoryService";

const ProductCrudPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [productCode, setProductCode] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState("Disabled");
  const [images, setImages] = useState([]);
  const [productImages, setProductImages] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const productService = new ProductService();
    const data = await productService.getAllProducts();
    setProducts(data);
  };

  const fetchCategories = async () => {
    const categoryService = new CategoryService();
    const data = await categoryService.getAllCategories();
    setCategories(data);
  };

  const fetchProductImages = async (productId) => {
    const productService = new ProductService();
    const images = await productService.getProductImages(productId);
    setProductImages(images);
  };

  const createOrUpdateProduct = async () => {
    const productService = new ProductService();
    
    if (selectedProductId) {
       
      await productService.updateProductById(
        selectedProductId,
        name,
        description,
        price,
        stock,
        productCode,
        categoryId.id,
        status
      );

      // Actualizar imágenes del producto
      decodeURI(images)
      await productService.uploadImage(selectedProductId, images);
    } else {
      const createdProduct = await productService.createProduct(
        name,
        description,
        price,
        stock,
        productCode,
        categoryId.id,
        status
      );

      // Cargamos las imágenes si se creó el producto correctamente
      if (createdProduct && createdProduct.id) {
        await productService.uploadImage(createdProduct.id, images);
      }
    }

    setShowDialog(false);
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    const productService = new ProductService();
    await productService.deleteProductById(id);

    // Eliminar imágenes del producto
    await productService.deleteImage(id);

    fetchProducts();
  };

  const openDialog = async (product) => {
    setSelectedProductId(product?.id || null);
    setName(product?.name || "");
    setDescription(product?.description || "");
    setPrice(product?.price || "");
    setStock(product?.stock || "");
    setProductCode(product?.product_code || "");
    setCategoryId(product?.category_id || "");
    setStatus(product?.status || "");
    setImages(product?.images || []);

    // Cargamos las imágenes del producto seleccionado
    await fetchProductImages(product?.id);
    setShowDialog(true);
  };

  const onImageUpload = (event) => {
    const files = event.files;
    const fileArray = Array.from(files);

    // Obtenemos las imágenes seleccionadas y las almacenamos en el estado de imágenes
    Promise.all(
      fileArray.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file);
        });
      })
    )
      .then((base64Array) => {
        setImages(base64Array);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const removeImage = async (index) => {
    const imageToDelete = productImages[index];
    const productService = new ProductService();

    // Eliminar la imagen del servidor
    await productService.deleteImage(imageToDelete.id);

    // Eliminar la imagen del estado de imágenes
    setProductImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const header = (
    <div className="p-d-flex p-ai-center">
      <h2>Lista de Productos</h2>
      <Button
        label="Crear Producto"
        icon="pi pi-plus"
        className="p-ml-auto"
        onClick={() => openDialog({})}
      />
    </div>
  );

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success p-mr-2"
          onClick={() => openDialog(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          onClick={() => deleteProduct(rowData.id)}
        />
      </React.Fragment>
    );
  };

  return (
    <div>
      <DataTable value={products} header={header}>
        <Column field="name" header="Nombre"></Column>
        <Column field="description" header="Descripción"></Column>
        <Column field="price" header="Precio"></Column>
        <Column field="stock" header="Stock"></Column>
        <Column field="product_code" header="Código de Producto"></Column>
        <Column field="category_id" header="ID de Categoría"></Column>
        <Column field="status" header="Estado"></Column>
        <Column body={actionBodyTemplate}></Column>
      </DataTable>

      <Dialog
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        header={selectedProductId ? "Editar Producto" : "Crear Producto"}
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="name">Nombre</label>
            <InputText id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="p-field">
            <label htmlFor="description">Descripción</label>
            <InputText id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="p-field">
            <label htmlFor="price">Precio</label>
            <InputText id="price" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>

          <div className="p-field">
            <label htmlFor="stock">Stock</label>
            <InputText id="stock" value={stock} onChange={(e) => setStock(e.target.value)} />
          </div>

          <div className="p-field">
            <label htmlFor="product_code">Código de Producto</label>
            <InputText id="product_code" value={productCode} onChange={(e) => setProductCode(e.target.value)} />
          </div>

          <div className="p-field">
            <label htmlFor="category_id">Categoría</label>
            <Dropdown
              id="category_id"
              value={categoryId}
              options={categories}
              optionLabel="name"
              onChange={(e) => setCategoryId(e.value)}
              placeholder="Seleccione una categoría"
            />
          </div>

          <div className="p-field">
            <label htmlFor="status">Estado</label>
            <Dropdown id="status" value={status} options={["Enabled", "Disabled"]} onChange={(e) => setStatus(e.value)} placeholder="Seleccione un estado" />
          </div>

          <div className="p-field">
            <label>Imágenes</label>
            <FileUpload name="demo" customUpload={true} uploadHandler={onImageUpload} accept="image/*" multiple={true} />
            {productImages.length  &&
              productImages.map((image, index) => (
                <div key={index} className="product-image">
                  <img src={image.url} alt={`Imagen ${index + 1}`} />
                  <Button icon="pi pi-times" className="p-button-rounded p-button-danger" onClick={() => removeImage(index)} />
                </div>
              ))}
          </div>
        </div>

        <div className="p-dialog-footer">
          <Button label="Cancelar" icon="pi pi-times" onClick={() => setShowDialog(false)} className="p-button-text" />
          <Button label={selectedProductId ? "Guardar" : "Crear"} icon="pi pi-check" onClick={createOrUpdateProduct} autoFocus />
        </div>
      </Dialog>
    </div>
  );
};

export default ProductCrudPage;
