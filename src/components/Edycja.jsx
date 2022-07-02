import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as uuid from 'uuid';

export default function Edycja() {
	const params = useParams();
	const navigate = useNavigate();
	let [surveyData, setSurveyData] = useState(localStorage.getItem('surveyData') ? JSON.parse(localStorage.getItem('surveyData')) : []);
	let [didAnswer, setDidAnswer] = useState(sessionStorage.getItem('surveyAnswered_' + params.surveyId) ? Number(sessionStorage.getItem('surveyAnswered_' + params.surveyId)) : null);
	let [survey, setSurvey] = useState(null);
	let [surveyIdx, setSurveyIdx] = useState(null);

	let [isClosed, setIsClosed] = useState("0");

	let [answers, setAnswers] = useState([]);
	let [title, setTitle] = useState("");

	if (survey === null) {
		for (let i = 0; i < surveyData.length; i++) {
			if (surveyData[i].uuid == params.surveyId) { 
				if (surveyData[i].closed !== undefined) setIsClosed("1");

				setSurveyIdx(surveyIdx); setSurvey(surveyData[i]); break; 
			
			}
		}
	}

	useEffect(() => {
		//console.log('got survey...');
		//console.log(JSON.stringify(survey, null, 2));

		if (survey) {
			setAnswers(survey.answers.map(elem => elem.text));
			setTitle(survey.question);
		}

	}, [survey]);

	if (!survey) return <>Brak takiego sondażu!</>;


	let odpowiedzi = survey.answers.map((elem, idx) =>
		<p key={idx}>{idx + 1}:
			<input value={elem.text} onChange={(evt) => {
				survey.answers[idx].text = evt.target.value;
				setSurvey({ ...survey });

				// setAnswers([...answers]);
			}} type="text" style={{ width: "500px" }}></input>

			<span>głosów: {survey.answers[idx] ? survey.answers[idx].points : 0} </span>{survey.answers[idx] && survey.answers[idx].points > 0 && <button onClick={(e) => { survey.answers[idx].points = 0; setSurvey({ ...survey }); }}>wyczyść</button>}
		</p>)

	function save() {

		let fullAns = survey.answers.filter(elem => elem.text.trim() !== '');

		if (fullAns.length < 2 || survey.question.trim() === '') {
			alert('sondaż musi posiadać co najmniej dwie odpowiedzi, oraz pytanie!');
			return;
		}

		survey.answers = fullAns;

		//console.log(JSON.stringify(survey, null, 2));
		//console.log(`isClosed: ${isClosed}`);

		if (isClosed === "1") {
			survey.closed = true;
		} else {
			delete survey.closed;
		}

		console.log(survey);

		for (let i = 0; i < surveyData.length; i++) {
			if (surveyData[i].uuid == survey.uuid) {

				surveyData[i] = survey;
				localStorage.setItem('surveyData', JSON.stringify(surveyData));
				navigate('/');
			}
		}

	}

	return <>
		<h2>edycja sondażu</h2>

		status:  <select value={isClosed} onChange={(e)=> { setIsClosed(e.target.value) }}>
			<option value="0">OTWARTY</option>
			<option value="1">ZAMKNIĘTY</option>
		</select>
		<p>Pytanie:</p>
		<textarea value={survey.question} onChange={(evt) => { survey.question = evt.target.value; setSurvey({ ...survey }) }} style={{ width: '100%', height: '100px' }}></textarea>

		<p>Odpowiedzi:</p>

		{odpowiedzi}

		<div><button onClick={(e) => { survey.answers.push({ text: "", points: 0 }); setSurveyIdx({ ...survey }) }} > DODAJ NOWĄ ODPOWIEDŹ </button></div>

		<p style={{ color: "#555555" }}>INFORMACJA: Podczas zapisywania niewypełnione odpowiedzi zostaną zignorowane</p>

		<div>
			<button style={{ marginRight: "10px" }} onClick={(e) => { window.history.back(); }}> ANULUJ </button>
			<button onClick={(e) => { save() }}> ZAPISZ </button>
		</div>

	</>;
}