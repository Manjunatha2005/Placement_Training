import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Test from './pages/Test';
import Coding from './pages/Coding';
import Resume from './pages/Resume';
import Chat from './pages/Chat';

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/dashboard', component: Dashboard },
  { path: '/courses', component: Courses },
  { path: '/test', component: Test },
  { path: '/coding', component: Coding },
  { path: '/resume', component: Resume },
  { path: '/chat', component: Chat },
];

export default routes;
