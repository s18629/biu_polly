import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

let colors = ["red", "blue", "green", "yellow", "pink"];

export default function Odpowiedz() {
    const params = useParams();
    const navigate = useNavigate();
    let [surveyData, setSurveyData] = useState(localStorage.getItem('surveyData') ? JSON.parse(localStorage.getItem('surveyData')) : []);
    let [didAnswer, setDidAnswer] = useState(sessionStorage.getItem('surveyAnswered_' + params.surveyId) ? Number(sessionStorage.getItem('surveyAnswered_' + params.surveyId)) : null);

    let survey = null;
    let surveyIdx = 0;

    for (let i = 0; i < surveyData.length; i++) {
        if (surveyData[i].uuid == params.surveyId) { surveyIdx = i; survey = surveyData[i]; break; }
    }

    if (!survey) return <>Brak takiego sondażu!</>;

    let totalVotes = 0;
    for (let ans of survey.answers) {
        totalVotes += ans.points;
    }

    function vote(idx) {
        console.log(`vote ${idx}`);

        setDidAnswer(idx);
        sessionStorage.setItem('surveyAnswered_' + params.surveyId, idx);

        surveyData[surveyIdx].answers[idx].points++;

        setSurveyData([...surveyData]);
        localStorage.setItem('surveyData', JSON.stringify(surveyData));
    }

    let percentages = [];
    let isClosed = false;
    if (survey.closed !== undefined) isClosed = true;

    return (
        <main style={{ padding: "1rem 0" }}>
            {isClosed && <h2>SONDAŻ ZAKOŃCZONY</h2>}
            {<h2>{survey.question}</h2>}
            <p>INFO: {didAnswer!==null ? <span style={{color: '#550000', fontWeight: 'bold'}}>Już odpowiedziałeś na ten sondaż (odpowiedź: {didAnswer+1}).</span> : "Jeszcze nie odpowiedziałeś na ten sondaż"}</p>
            <p>do tej pory oddano głosów: {totalVotes}</p>
            <p style={{ fontWeight: 'bold' }}>odpowiedzi: </p>

            {survey.answers.map((answer, idx) => {

                let percent = 0;
                if (totalVotes > 0) {
                    percent = answer.points / totalVotes * 100;
                    percentages.push(percent);

                    percent = percent.toFixed(0);

                }

                return <p key={idx}>{idx + 1}. {answer.text} [głosów: {answer.points}{totalVotes > 0 ? ", " + percent + "%" : ""}]
                    {isClosed === false && didAnswer === null && <button onClick={(e) => { vote(idx); }} style={{ marginLeft: '10px' }}>ZAGŁOSUJ</button>}
                </p>
            })}

            <div style={{  margin: "10px", height: "25px" }}>

                {percentages.map((elem, idx) => {
                    if (elem === 0) return <></>;
                    return <div key={idx} style={{ backgroundColor: colors[idx%5], color: 'white', textAlign: 'center', display: 'inline-block', width: (elem-1)+"%", border: "1px solid black", height: "100%" }}><b>{idx +1 }:</b> {elem.toFixed(0)}%</div>
                })}


            </div>

            <div>
                <button style={{ marginRight: "10px" }} onClick={(e) => { navigate(`/`) }}> POWRÓT </button>
                {/* <button onClick={(e) => { navigate(`/edytuj/${idx}`) }}> EDYTUJ </button> */}
            </div>


        </main>
    );
}

