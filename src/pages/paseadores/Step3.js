import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Col, Form, Row } from "reactstrap";

const Step3 = ({ onNext, onPrevious, step1Data, step2Data }) => {
  const daysOfWeek = [
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
    "domingo",
  ];
  const timePeriods = ["manana", "tarde", "noche"];
  const [scheduleData, setScheduleData] = useState({});
  const [isAtLeastOneSelected, setIsAtLeastOneSelected] = useState(false);

  useEffect(() => {
    const initialScheduleData = {};
    for (const day of daysOfWeek) {
      initialScheduleData[day.toLowerCase()] = {};
      for (const period of timePeriods) {
        initialScheduleData[day.toLowerCase()][period.toLowerCase()] = false;
      }
    }
    setScheduleData(initialScheduleData);
  }, []);

  useEffect(() => {
    const isOneSelected = Object.values(scheduleData).some((dayData) =>
      Object.values(dayData).some((isSelected) => isSelected)
    );
    setIsAtLeastOneSelected(isOneSelected);
  }, [scheduleData]);

  const handleCheckboxChange = (day, period, isChecked) => {
    setScheduleData((prevData) => ({
      ...prevData,
      [day.toLowerCase()]: {
        ...prevData[day.toLowerCase()],
        [period.toLowerCase()]: isChecked,
      },
    }));
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    if (!isAtLeastOneSelected) {
      // Mostrar el mensaje de error si no hay horarios seleccionados
      setIsAtLeastOneSelected(false);
      return;
    }

    const combinedData = {
      ...data,
      grilla: {
        scheduleData: { ...scheduleData },
      },
    };

    onNext({ ...step1Data, ...step2Data, ...combinedData });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <h3 className="form-label text-center">Horarios de Paseo</h3>
        <Col lg={12} className="d-flex justify-content-center">
          <div className="mb-3 w-100">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th></th>
                  {daysOfWeek.map((day) => (
                    <th key={day}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timePeriods.map((period) => (
                  <tr key={period}>
                    <td>{period}</td>
                    {daysOfWeek.map((day) => (
                      <td key={day} className="checkbox-cell">
                        <div className="custom-checkbox">
                          <input
                            type="checkbox"
                            onChange={(e) =>
                              handleCheckboxChange(
                                day,
                                period,
                                e.target.checked
                              )
                            }
                          />
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Col>
      </Row>

      {!isAtLeastOneSelected && (
        <div className="text-danger text-center mb-3">
          Debe seleccionar al menos un horario.
        </div>
      )}

      <Col className="button-container">
        {onPrevious && (
          <button className="btn-next-paseador" onClick={onPrevious}>
            <span className="transition transition-back"></span>
            <span className="gradient"></span>
            <span className="label">Atrás</span>
          </button>
        )}

        <button
          className="btn-next-paseador"
          type="submit"
          disabled={!isAtLeastOneSelected}
        >
          <span className="transition"></span>
          <span className="gradient"></span>
          <span className="label">Siguiente</span>
        </button>
      </Col>
    </Form>
  );
};

export default Step3;
