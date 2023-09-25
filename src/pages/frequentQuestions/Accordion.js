import React, { useState } from "react";

const Accordion = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleClick = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <div className="accordion">
      {data.map((item) => (
        <div key={item.id} className="accordion-item">
          <div
            className={`title ${activeIndex === item.id ? "active" : ""}`}
            onClick={() => handleClick(item.id)}
          >
            <div className="title-text">{item.question}</div>
            <div className="arrow-wrapper">
              <i
                className={`fas fa-angle-down ${
                  activeIndex === item.id ? "fa-rotate-180" : ""
                }`}
              ></i>
            </div>
          </div>
          <div className={`content ${activeIndex === item.id ? "content-open" : ""}`}>
            <div className={`content-text ${activeIndex === item.id ? "content-text-open" : ""}`}>
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
