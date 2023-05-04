import { questions, QuestionWithExamples } from "@/utils/constants";
import { updateUserProfile } from "@/utils/editProfile";
import { AuthState, useAuth } from "@/utils/firebaseFunctions";
import { QuestionAnswerMap } from "@/utils/types";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function Profile() {
	const [answerMap, setAnswerMap] = useState<QuestionAnswerMap>({});
	const [name, setName] = useState<string>("");
	
	const auth: AuthState = useAuth();
	const router = useRouter();

	function unauthenticatedRedirect() {
		toast.info('Please sign up first!', {
			position: "bottom-left",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "colored",
			});
		router.replace("/signup");
	}

	useEffect(() => {
		if (!auth.isAuthenticated) {
			unauthenticatedRedirect();
		} else {
			initAnswerMap();
		}
	}, [auth]);

	function initAnswerMap() {
		if (auth.user == undefined) {
			unauthenticatedRedirect();
			return;
		}

		if (auth.user.questions == undefined) {
			return;
		}

		if (auth.user.name == undefined) {
			return;
		}

		setName(auth.user.name);

		let newMap: QuestionAnswerMap = {};
		for (var question of questions) {
			newMap[question.q] = auth.user.questions[question.q];
		}
		setAnswerMap(newMap);
	}

	function setMap(k: string, v: string) {
		let map = { ...answerMap};
		map[k] = v;
		setAnswerMap(map);
	}

	function emptinessCheck() {
		let valid = true;
		for (var question of questions) {
			if (!(question.q in answerMap)) {
				valid = false;
			} else if (answerMap[question.q].trim().length == 0) {
				valid = false;
			}
		}

		if (!valid) {
			toast.error("Please answer all questions before submitting update!", {
				position: "bottom-left",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});
		}
		return valid;
	}

	async function callUpdate() {
		if (auth.user?.id != undefined) {
			if (!emptinessCheck()) {
				return;
			}
			
			await updateUserProfile(auth.user.id, {
				name: name,
				questions: answerMap
			});
			
			// Local user update
			auth.user.name = (' ' + name).slice(1);
			auth.user.questions = {...answerMap};

			toast.success("Profile updated!", {
				position: "bottom-left",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
				})
		} else {
			unauthenticatedRedirect();
		}
	}

	return (
	<main className={"grow flex flex-col justify-center w-screen text-orange-900 md:pt-8 pb-14"}>
		<div className="w-full text-center text-3xl font-semibold mb-3">
			YOUR RESPONSES
		</div>
		<div className="text-center text-lg italic mb-6">
			update your responses here
		</div>
		<div className="w-full flex flex-wrap justify-center mb-6">
		{
				questions.map((question: QuestionWithExamples, i: number) => {
					return (
					<div
					key={i}
					className="mx-4 my-2 w-1/4 mx-auto font-semibold bg-orange-100 rounded-lg p-4 flex flex-col justify-between">
						<label className="mb-2">{question.q}</label>
						<input type="text" className="w-full rounded-md px-3 py-1 font-normal bg-orange-300 text-orange-900"
						onChange={(e) => {
							setMap(question.q, e.currentTarget.value);
						}}
						value={answerMap[question.q]}/>
					</div>)
				})
			}
			<div
				className="mx-4 my-2 w-1/4 mx-auto font-semibold bg-orange-100 rounded-lg p-4 flex flex-col justify-between">
				<label className="mb-2">Finally, what&apos;s your name?</label>
					<input type="text" className="w-full rounded-md px-3 py-1 font-normal bg-orange-300 text-orange-900"
					onChange={(e) => {
						setName(e.currentTarget.value);
					}}
					value={name}/>
			</div>

		</div>
		<div className="w-full flex flex-row justify-center mb-4">
				<button className="px-6 py-3 bg-orange-900 text-white font-semibold rounded-lg" type="button"
				onClick={callUpdate}>
					Update
				</button>
		</div>
	</main>
	)
}


