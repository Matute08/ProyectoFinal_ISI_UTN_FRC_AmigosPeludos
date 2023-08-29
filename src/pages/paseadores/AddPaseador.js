import React, {useRef, useState, useEffect} from "react";
import { Form } from "reactstrap";
 
  
  const AddPaseador = () => {
    const stagesRef = useRef(null);
    const progressLineRef = useRef(null);
    const buttonNextRef = useRef(null);
    const buttonPrevRef = useRef(null);
    const [progressIncrement, setProgressIncrement] = useState(0);
    const [progressPercent, setProgressPercent] = useState(0);
    const [activeStage, setActiveStage] = useState(0);
  
    useEffect(() => {
      const stageElements = stagesRef.current.querySelectorAll(".stage");
      const increment = Math.floor(100 / (stageElements.length - 1));
      setProgressIncrement(increment);
    }, []);
  
    const handleButtonNextClick = (ev) => {
      if (activeStage >= stagesRef.current.querySelectorAll(".stage").length - 1)
        return;
      if (activeStage === 0) {
        buttonPrevRef.current.classList.remove("hidden");
        buttonNextRef.current.style.right = "0";
      }
      progressLineRef.current.style.width = `${
        progressPercent + progressIncrement
      }%`;
      setProgressPercent(progressPercent + progressIncrement);
      stagesRef.current
        .querySelectorAll(".stage")
        .forEach((stageElement, key) => {
          if (key <= activeStage + 1) {
            stageElement.classList.add("selected");
          }
        });
      setActiveStage(activeStage + 1);
    };
  
    const handleButtonPrevClick = (ev) => {
      if (activeStage <= 0) return;
      if (activeStage === 1) {
        buttonPrevRef.current.classList.add("hidden");
        buttonNextRef.current.style.right = "var(--btn-right-shift)";
      }
      progressLineRef.current.style.width = `${
        progressPercent - progressIncrement
      }%`;
      setProgressPercent(progressPercent - progressIncrement);
      stagesRef.current
        .querySelectorAll(".stage")
        .forEach((stageElement, key) => {
          if (key > activeStage - 1) {
            stageElement.classList.remove("selected");
          }
        });
      setActiveStage(activeStage - 1);
    };
  
    return (
      <div className="progress-bar">
        <div ref={stagesRef} className="stages">
          <div ref={progressLineRef} className="progress-line"></div>
          <div className="stage selected">1</div>
          <div className="stage">2</div>
          <div className="stage">3</div>
          <div className="stage">4</div>
        </div>
        
        <Form>
            <label htmlFor="">nombnre</label>
            <input type="text" />
        </Form>
        <div className="ctrl">
          <div
            ref={buttonPrevRef}
            className="btn hidden"
            id="prev"
            onClick={handleButtonPrevClick}
          >
            Prev
          </div>
          <div
            ref={buttonNextRef}
            className="btn"
            id="next"
            onClick={handleButtonNextClick}
          >
            Next
          </div>
        </div>
      </div>
    );
  };
  export default AddPaseador;
  