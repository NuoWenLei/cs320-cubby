import { QuestionWithExamples, questions } from "@/utils/constants";
import { QuestionAnswerMap } from "@/utils/types";
import { useState } from "react";

export default function Signup() {
	const [answerMap, setAnswerMap] = useState<QuestionAnswerMap>({});

	function setMap(k: string, v: string) {
		let map = answerMap;
		map[k] = v;
		setAnswerMap(map);
	}

	function callSignup() {

	}

	return (
		<main className={"grow flex flex-col justify-center w-screen text-orange-900 md:pt-8 pb-14"}>
			<div className="w-full md:w-2/3 mx-auto rounded-lg bg-transparent md:bg-orange-200 p-5 flex flex-col text-lg lg:text-xl">
				<div className="w-full text-center text-2xl lg:text-3xl mb-3">
					Answer these 8 questions to start matching!
				</div>
				<div className="w-full text-center text-lg lg:text-xl mb-6">
				Note: Try to use as FEW words as possible!
				</div>

				{
					questions.map((question: QuestionWithExamples) => {
						return (
						<div className="mb-6 w-2/3 h-1/6 mx-auto md:font-normal font-bold">
							<label className="mb-2">{question.q}</label>
							<input type="text" className="w-full rounded-md px-3 py-1 font-normal"
							onChange={(e) => {
								setMap(question.q, e.currentTarget.value);
							}}
							placeholder={"Ex: " + question.example}/>
						</div>)
					})
				}

				<div className="w-full flex flex-row justify-center mb-4">
					<button className="px-3 py-2 bg-orange-900 text-white rounded-lg" type="button"
					onClick={callSignup}>
						Sign Up with Google
						</button>
				</div>
			</div>
		</main>
	)
}