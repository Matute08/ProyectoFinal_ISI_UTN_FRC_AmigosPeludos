import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Col, Form, Row,Label } from "reactstrap";

const Step3 = ({ onNext, onPrevious, step1Data, step2Data }) => {
  const daysOfWeek = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];
  const timePeriods = ["Mañana", "Tarde", "Noche"];

  const [scheduleData, setScheduleData] = useState({});

  const handleCheckboxChange = (day, period, isChecked) => {
    setScheduleData((prevData) => ({
      ...prevData,
      [day]: {
        ...(prevData[day] || {}),
        [period]: isChecked,
      },
    }));
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const selectedData = {};
    for (const day in scheduleData) {
      selectedData[day] = {};
      for (const period in scheduleData[day]) {
        if (scheduleData[day][period]) {
          selectedData[day][period] = true;
        }
      }
    }

    const combinedData = { ...data, scheduleData: selectedData };

    onNext({ ...step1Data, ...step2Data, ...combinedData });
  };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
                {/* DIAS DE TRABAJO */}
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
                                            <td
                                                key={day}
                                                className="checkbox-cell"
                                            >
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

            <Col className="button-container">
                {onPrevious && (
                    <button className="btn-next-paseador" onClick={onPrevious}>
                        <span class="transition transition-back"></span>
                        <span class="gradient"></span>
                        <span class="label">Atras</span>
                    </button>
                )}

                <button className="btn-next-paseador" type="submit">
                    <span class="transition"></span>
                    <span class="gradient"></span>
                    <span class="label">Siguiente</span>
                </button>
            </Col>
        </Form>
    );
};

export default Step3;
