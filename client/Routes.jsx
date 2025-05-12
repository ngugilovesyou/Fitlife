import {createBrowserRouter} from 'react-router-dom'
import App from './src/App'
import About from './src/Components/About'
import Services from './src/Components/Services'
import Contact from './src/Components/Contact'
import Membership from './src/Components/Membership'
import Login from './src/Components/Login'
import Dashboard from './src/Components/Dashboard'
import Profile from './src/Components/Profile'

const routes = createBrowserRouter([
    {
        path:"/",
        element:<App />
    },
    {
        path:"/about",
        element:<About />
    },
    {
        path:"/services",
        element:<Services />
    },
    {
        path:"/contact",
        element:<Contact />
    },
    {   
        path:"/membership",
        element:<Membership />
    },
    {
        path:"/login",
        element:<Login />
    },
    {
        path:"/dashboard",
        element:<Dashboard /> 
    },
    {
        path:"/profile",
        element:<Profile />
    },
    {
        path:"*",
        element:<h1>Page Not Found</h1>
    }
])

export default routes