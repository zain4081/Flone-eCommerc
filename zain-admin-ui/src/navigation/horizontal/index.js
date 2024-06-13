import { Mail, Home, Circle } from "react-feather";



export default [
  {
    id: "home",
    title: "Home",
    icon: <Home size={20} />,
    navLink: "/home",
  },
  {
    id: 'blog',
    title: 'Blog',
    icon: <Circle size={12} />,
    children: [
      {
        id: 'blogList',
        title: 'List',
        permissions: ['admin', 'editor'],
        navLink: '/pages/blog/list'
      },
      {
        id: 'blogDetail',
        title: 'Detail',
        permissions: ['admin', 'editor'],
        navLink: '/pages/blog/detail'
      },
      {
        id: 'blogEdit',
        title: 'Edit',
        permissions: ['admin', 'editor'],
        navLink: '/pages/blog/edit'
      }
    ]
  },
  {
    id: "secondPage",
    title: "Second Page",
    icon: <Mail size={20} />,
    navLink: "/second-page",
  },
];
