import {
	BrowserRouter,
	Routes,
	Route,
	Link
  } from "react-router-dom";
import DodajNowy from "./components/DodajNowy";

import Edycja from "./components/Edycja";
import Home from "./components/Home";
import Odpowiedz from "./components/Odpowiedz";

function App() {
	return (
		<div className="App" style={{ border: "1px solid black", width: "800px", margin: "auto", padding: '10px' }}>

			<h1>Sondaże</h1>

			{/* <Link to="/edycja">Expenses</Link> */}


				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/edytuj/:surveyId" element={<Edycja />} />
					<Route path="/odpowiedz/:surveyId" element={<Odpowiedz />} />
					<Route path="/dodaj_nowy" element={<DodajNowy />} />
				</Routes>



		</div>
	);
}

export default App;
