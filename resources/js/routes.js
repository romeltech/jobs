import Dashboard from './components/admin/Dashboard';
import PostList from './components/admin/posts/PostList';
import CreatePost from './components/admin/posts/CreatePost';
import CategoryList from './components/admin/posts/CategoryList';
import CustomFields from './components/admin/posts/CustomFields';
import EditPost from './components/admin/posts/EditPost';
import UserList from './components/admin/users/UserList';
import UserForm from './components/admin/users/UserForm';
export const routes = [
    {
        path: '/admin/dashboard',
        component: Dashboard,
    },
    {
        path: '/admin/posts',
        component: PostList,
    },
    {
        path: '/admin/post/create',
        component: CreatePost,
    },
    {
        path: '/admin/post/edit/:id',
        name: 'EditPost',
        component: EditPost,
        props: true
    },
    {
        path: '/admin/post/categories',
        component: CategoryList,
    },
    {
        path: '/admin/post/customfields',
        component: CustomFields,
    },
    {
        path: '/admin/users',
        component: UserList,
    },
    {
        path: '/admin/user/create',
        component: UserForm,
    }
]