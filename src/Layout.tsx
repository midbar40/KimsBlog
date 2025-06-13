import { Outlet } from 'react-router-dom';
import { Navbar } from './components/index'


const Layout = () => {
    return (
        <div className="mx-auto w-full mt-5">
            <Navbar />
            <main className="size-[80%] bg-white m-auto">
                <Outlet />
            </main>
        </div>
    )
}

export default Layout