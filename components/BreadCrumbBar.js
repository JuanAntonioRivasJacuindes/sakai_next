import React from 'react';
import { BreadCrumb } from 'primereact/breadcrumb';
import { useRouter } from 'next/router'; // Importa el enrutador de Next.js

export default function BreadCrumbBar() {
  const router = useRouter(); // Obtiene el enrutador de Next.js
  const items = [];
  const home = { icon: 'pi pi-home', url: '/' };
  const location = router.asPath.split('/');

  let routes = '';
  location.map((obj) => {
    if (obj !== '') {
      routes = routes + '/' + obj;
      items.push({ label: obj.toUpperCase(), url: routes });
    }
  });

  return <BreadCrumb model={items} home={home} className="shadow-3 my-3" />;
}
