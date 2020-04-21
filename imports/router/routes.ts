import { ComponentClass, FC } from 'react';
import SignIn from '../ui/pages/SignIn';
import Document from '../ui/pages/Document';
import Documents from '../ui/pages/Documents';
import Users from '../ui/pages/Users';

type Route = {
    path: string
    protected: boolean
    component: ComponentClass | FC
}

const routes: Route[] = [
    { path: '/signin', protected: false, component: SignIn},
    { path: '/users', protected: true, component: Users},
    { path: '/documents', protected: true, component: Documents},
    { path: '/document/:documentId/:paragraphId?', protected: true, component: Document }
];

export default routes;