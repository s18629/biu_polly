import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home(props) {
    const navigate = useNavigate();
    let [surveyData, setSurveyData] = useState(localStorage.getItem('surveyData') ? JSON.parse(localStorage.getItem('surveyData')) : []);

    return <>
        <h2>Strona główna</h2>
        
        <p> Ilość sondaży: {surveyData.length}</p>

        <div><button onClick={(e) => { navigate('/dodaj_nowy'); }}> DODAJ NOWY SONDAŻ </button></div>


        {surveyData.map((elem, idx) => {

            return <div key={idx} style={{ margin: "5px" }}>
                <h2>{elem.closed !== undefined ? "[ZAMKNIĘTE]" : "[OTWARTE]"} {elem.question}</h2>

                {elem.answers.map((answer, idx) => {

                    return <p key={idx}>{idx + 1}. {answer.text} [głosów: {answer.points}] </p>
                })}


                <div>
                    <button style={{ marginRight: "10px" }} onClick={(e) => { navigate(`/odpowiedz/${elem.uuid}`) }}> ODPOWIEDZ </button>
                    <button onClick={(e) => { navigate(`/edytuj/${elem.uuid}`) }}> EDYTUJ </button>
                </div>

            </div>

        })}
    </>;
}