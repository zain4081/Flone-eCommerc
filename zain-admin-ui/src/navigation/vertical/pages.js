// ** Icons Import
import { FileText, Circle} from 'react-feather'

export default [
  {
    id: 'blog',
    title: 'Blog',
    icon: <FileText size={12} />,
    children: [
      {
        id: 'blogList',
        title: 'List',
        navLink: '/pages/blog/list'
      },
      {
        id: 'blogDetail',
        title: 'Detail',
        navLink: '/pages/blog/detail'
      },
      {
        id: 'blogEdit',
        title: 'Edit',
        navLink: '/pages/blog/edit'
      },
      {
        id: 'blogAdd',
        title: 'Add',
        navLink: '/pages/blog/add'
      }
    ]
  }
]
