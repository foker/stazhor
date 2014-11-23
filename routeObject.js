/**
 * Created by gerasimovnv on 30.07.2014.
 */

module.exports = {
    /*_admin: [
        {method: 'get', action: 'auth', path: '/admin/auth'},
        {method: 'post', action: 'create', path: '/admin/create'},
        {method: 'post', action: 'enter', path: '/admin/enter'},
        {method: 'get', action: 'exit', path: '/admin/exit'},
        {method: 'get', action: 'new', path: '/admin/new'}
    ],

    _cabinet: [
        {method: 'get', action: 'admin', path: '/panel'},
        {method: 'get', action: 'employer', path: '/cabinet'}
    ],

    _category: [
        {method: 'post', action: 'create', path: '/admin/categories/create'},
        {method: 'get', action: 'list', path: '/admin/categories'},
        {method: 'get', action: 'new', path: '/admin/categories/new'},
        {method: 'post', action: 'save', path: '/admin/categories/:id/save'},
        {method: 'post', action: 'switch', path: '/admin/categories/:id/switch'},
        {method: 'post', action: 'update', path: '/admin/categories/:id/update'}
    ],

    _employer: [
        {method: 'get', action: 'auth', path: '/auth'},
        {method: 'post', action: 'create', path: '/create-employer'},
        {method: 'get', action: 'edit', path: '/card/edit'},
        {method: 'post', action: 'enter', path: '/enter'},
        {method: 'get', action: 'exit', path: '/exit'},
        {method: 'get', action: 'new', path: '/register'},
        {method: 'get', action: 'read', path: '/employer/:id'},
        {method: 'post', action: 'save', path: '/card/save'}
    ],

    _post: [
        {method: 'post', action: 'create', path: '/post'},
        {method: 'post', action: 'delete', path: '/postdelete/:id'},
        {method: 'get', action: 'edit', path: '/edit/:id'},
        {method: 'get', action: 'new', path: '/new'},
        {method: 'get', action: 'read', path: '/post/:id'},
        {method: 'post', action: 'save', path: '/postsave/:id'}
    ],*/

    _search: [
        {method: 'get', action: 'adminBlack', path: '/admin/posts/blacklist'},
        {method: 'get', action: 'adminBlack', path: '/admin/posts/blacklist/page/:page'},
        {method: 'get', action: 'adminUnseen', path: '/admin'},
        {method: 'get', action: 'adminUnseen', path: '/admin/page/:page'},
        {method: 'get', action: 'adminWhite', path: '/admin/posts/whitelist'},
        {method: 'get', action: 'adminWhite', path: '/admin/posts/whitelist/page/:page'},
        {method: 'get', action: 'search', path: '/'},
        {method: 'get', action: 'search', path: '/page/:page'}
    ]

};