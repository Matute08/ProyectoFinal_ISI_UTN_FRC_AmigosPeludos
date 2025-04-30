import React, { useEffect } from "react";
import Home from "./Home";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Services from "./Services";

const Landing = () => {
    document.title = "AMIGOS PELUDOS";

    useEffect(() => {
        // Desplaza la página hacia arriba al cargar
        scrollToTop();

        // Agrega el evento de scroll para mostrar/ocultar el botón "back-to-top"
        const handleScroll = () => {
            const element = document.getElementById("back-to-top");
            if (element) {
                element.style.display = window.scrollY > 100 ? "block" : "none";
            }
        };

        window.addEventListener("scroll", handleScroll);

        // Limpia el evento al desmontar el componente
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <React.Fragment>
            <Navbar isHomePage={true} />
            <Home />
            <Services />
            <Footer />

            <div className="layout-wrapper landing">
                <button
                    onClick={scrollToTop}
                    className="btn btn-danger btn-icon landing-back-top"
                    id="back-to-top"
                >
                    <i className="ri-arrow-up-line"></i>
                </button>
            </div>
        </React.Fragment>
    );
};

export default Landing;
