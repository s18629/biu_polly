import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as uuid from 'uuid';
export default function DodajNowy() {

    const navigate = useNavigate();
    let [surveyData, setSurveyData] = useState(localStorage.getItem('surveyData') ? JSON.parse(localStorage.getItem('surveyData')) : []);
    let [answers, setAnswers] = useState(["", ""]);
    let [title, setTitle] = useState("");

    let odpowiedzi = answers.map((elem, idx) => 
        <p key={idx}>{idx + 1}: 
            <input value={elem} onChange={ (evt)=> {
                answers[idx] = evt.target.value;
                setAnswers([...answers]);
            }} type="text" style={{ width: "500px" }}></input>
        </p>)

    function save() {

        let fullAnswers = answers.filter(elem=> elem.trim()!=='');

        if (fullAnswers.length< 2 || title.trim()==='') {
            alert('musisz dodać co najmniej dwie odpowiedzi, oraz uzupełnić pytanie!');
            return;
        }

        let survey = {
            uuid: uuid.v4(),
            question: title,
            answers: fullAnswers.map((elem)=> {
                return {text: elem, points: 0}
            })
        }

        // console.log(JSON.stringify(survey, null, 2));

        surveyData.push(survey);
        localStorage.setItem('surveyData', JSON.stringify(surveyData));
        navigate('/');
    }

    return <>
        <h2>tworzenie nowego sondażu</h2>

        <p>Pytanie:</p>
        <textarea value={title} onChange={(evt)=> {setTitle(evt.target.value)} } style={{ width: '100%', height: '100px' }}></textarea>

        <p>Odpowiedzi:</p>

        {odpowiedzi}

        <div><button onClick={(e) => { answers.push(""); setAnswers([...answers]) }} > DODAJ NOWĄ ODPOWIEDŹ </button></div>

        <p style={{ color: "#555555" }}>INFORMACJA: Podczas zapisywania niewypełnione odpowiedzi zostaną zignorowane</p>

        <div>
            <button style={{marginRight: "10px"}} onClick={(e) => { window.history.back(); }}> ANULUJ </button>
            <button onClick={(e) => { save() }}> ZAPISZ </button>
        </div>

    </>;
}