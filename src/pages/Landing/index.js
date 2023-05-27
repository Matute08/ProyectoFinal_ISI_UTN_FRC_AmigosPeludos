import React,{useEffect, useState} from "react";
import Home from "./Home";
import Footer from "./footer";
import Services from "./services";
import Navbar from "./Navbar";
import { getUsuarios } from "../../api/api";

const Landing = () => {
    document.title = " AMIGOS PELUDOS";



    useEffect(() => {
        getUsuarios() // esta aca para probar si funciona la api. se carga el landing y deberia mostrarse en consola
        toTop(); // Desplaza la página hacia arriba al cargar
      }, []);

    window.onscroll = function () {
        scrollFunction();
    };

    const scrollFunction = () => {
        const element = document.getElementById("back-to-top");
        if (element) {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                element.style.display = "block";
            } else {
                element.style.display = "none";
            }
        }
    };

    const toTop = () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };

    return (
        <React.Fragment>

                <Navbar/>
                <Home/>
                <Services/>
                <Footer/>
                
            <div className="layout-wrapper landing">
                
                <button onClick={() => toTop()} className="btn btn-danger btn-icon landing-back-top" id="back-to-top">
                    <i className="ri-arrow-up-line"></i>
                </button>
            </div>


        </React.Fragment>
    );
};

export default Landing;