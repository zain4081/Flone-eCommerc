import { Mail, Home, Circle,FileText } from "react-feather";
import pages from './pages'

export default [
  {
    id: "home",
    title: "Home",
    icon: <Home size={20} />,
    navLink: "/home",
  },
  {
    id: "secondPage",
    title: "Bulk Upload",
    icon: <Mail size={20} />,
    navLink: "/second-page",
  }, ...pages
];
