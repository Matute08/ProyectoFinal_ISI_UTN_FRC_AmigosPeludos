import React, { useState, useEffect } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import Navbar from "../landing/Navbar";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import Footer from "../landing/Footer";
import { FormProvider, useForm } from "react-hook-form";


const steps = [Step1, Step2, Step3, Step4, Step5];

const AddPaseador = ({ methods }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [step1Data, setStep1Data] = useState({});
  const [step2Data, setStep2Data] = useState({});
  const [step3Data, setStep3Data] = useState({});
  const [step4Data, setStep4Data] = useState({});

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 600);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  const handleNext = (data) => {
    setFormData((prevData) => ({ ...prevData, ...data }));
    if (currentStep === steps.length - 1) {
      console.log("Datos finales:", formData);



    } else {
      if (currentStep === 0) {
        setStep1Data(data);
      } else if (currentStep === 1) {
        setStep2Data(data);
      } else if (currentStep === 2) {
        setStep3Data(data);
      }else if (currentStep === 3) {
        setStep4Data(data);
      }
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  const StepComponent = steps[currentStep];

  return (
    <React.Fragment>
      <FormProvider {...methods}>
        <>
          <Navbar />
          <Container fluid className="page-content perfil-fondo">
            <Row>
              <Col className="text-center mb-4">
                <h1>REGISTRO DE PASEADORES</h1>
              </Col>
            </Row>
            <Row>
              <Col className="d-flex justify-content-center">
                <Card className={`${window.innerWidth < 600 ? 'w-75' : 'w-50'}`}>
                  <CardHeader className="d-flex justify-content-center">
                    <div
                      className="progress w-50 m-0"
                      style={{
                        "--progress-width": `${
                          (currentStep + 1) * (100 / steps.length)
                        }%`,
                      }}
                    />
                  </CardHeader>

                  <CardBody className="card-paseador">
                    <StepComponent
                      onNext={handleNext}
                      onPrevious={handlePrevious}
                      step1Data={step1Data}
                      step2Data={step2Data}
                      step3Data={step3Data}
                      step4Data={step4Data}
                      methods={methods}
                    />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
          <Footer />
        </>
      </FormProvider>
    </React.Fragment>
  );
};

export default AddPaseador;
