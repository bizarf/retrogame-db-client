import { Outlet } from "react-router-dom";
import Header from "../UI/Header";
import Footer from "../UI/Footer";

const MainLayout = () => {
    return (
        <>
            <Header />
            {/* this flex class is to push the footer down */}
            <div className="flex-[1_0_auto]">
                {/* child elements from the router will load here */}
                <Outlet />
            </div>
            <Footer />
        </>
    );
};

export default MainLayout;
