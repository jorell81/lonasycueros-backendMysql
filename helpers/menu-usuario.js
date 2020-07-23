const getMenuUsuario = (rol = 'USER_ROLE') => {
    const menu = [{
        titulo: 'Operación',
        icono: 'mdi mdi-cash-usd',
        submenu: [
            { titulo: 'Ventas', url: '/ventas' },
            { titulo: 'Mis Ventas', url: '/misventas' },
        ]
    }];

    if (rol === 'ADMIN_ROLE') {
        menu.push({
            titulo: 'Paramétricas',
            icono: 'mdi mdi-gauge',
            submenu: [
                { titulo: 'Categorías', url: '/categorias' },
                { titulo: 'Sub Categorías', url: '/subcategorias' },
                { titulo: 'Productos', url: '/productos' },
                { titulo: 'Clientes', url: '/clientes' },
                { titulo: 'Código de Barras', url: '/codigobarras' },
                /* { titulo: 'Gráficas', url: '/graficas1'},
                { titulo: 'Promesas', url: '/promesas'}, */
            ]
        });
        menu.push({
            titulo: 'Administración',
            icono: 'mdi mdi-settings',
            submenu: [
                { titulo: 'Usuarios', url: '/usuarios' },
                { titulo: 'Reportes', url: '/reportes' },
            ]
        });
    }

    return menu;
};

module.exports = {
    getMenuUsuario
}