// ** Icons Import
import { FileText } from 'react-feather'

const userRole = localStorage.getItem('user_role');
console.log("User_role: " , userRole ? userRole : "null")

let blogChildren = [
];

if (userRole) {
  blogChildren.push(  {
    id: 'blogList',
    title: 'List',
    navLink: '/pages/blog/list'
  },
  {
    id: 'blogDetail',
    title: 'Detail',
    navLink: '/pages/blog/detail'
  });
}

if (userRole && (userRole === 'editor' || userRole === 'superuser')) {
  blogChildren.push({
    id: 'blogEdit',
    title: 'Edit',
    navLink: '/pages/blog/edit'
  });
}

if (userRole && (userRole === 'creator' || userRole === 'superuser')) {
  blogChildren.push({
    id: 'blogAdd',
    title: 'Add',
    navLink: '/pages/blog/add'
  });
}

export default [
  {
    id: 'blog',
    title: 'Blog',
    icon: <FileText size={12} />,
    children: blogChildren
  }
]
