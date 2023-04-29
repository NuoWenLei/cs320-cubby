import { API_URL, QuestionWithExamples, questions } from "@/utils/constants";
import { AuthState, useAuth } from "@/utils/firebaseFunctions";
import { createNewUser } from "@/utils/firebaseWriteFunctions";
import { QuestionAnswerMap, User } from "@/utils/types";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Signup() {
	const [answerMap, setAnswerMap] = useState<QuestionAnswerMap>({});
	const [name, setName] = useState<string>("");

	const router = useRouter();
	const auth: AuthState = useAuth();

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
			toast.error("Please make sure you answered all questions!", {
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

	async function getNewMatches(user_id: string) {
		const queryUrl = `${API_URL}/friendMatches?user_id=${user_id}&num_suggestions=4`;
		console.log(queryUrl);
		return await fetch(queryUrl, {
			method: "GET",
			headers: {
				"Access-Control-Allow-Origin": "*"
			}
		});
	}

	async function callSignup() {
		if (auth.isAuthenticated) {
			toast.info("You're already logged in!", {
				position: "bottom-left",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
				});
			router.push("/matches");
		} else {
			const res: User | string | boolean = await auth.signInWithGoogle();
			if (typeof res == "string") {

				if (!emptinessCheck()) {
					return;
				}

				const new_id = await createNewUser({
					"email": res,
					"name": name.trim(),
					"questions": answerMap
				});
				if (typeof new_id == "string") {
					toast.success("Account created! Welcome to Cubby!", {
						position: "bottom-left",
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
						theme: "colored",
					});

					const response = await getNewMatches(new_id);
					if (response.status == 200) {
						const results = await response.json();
						toast.info(`We have just matched you with ${results.added_groups ? results.added_groups.length : 0} groups`, {
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

					window.location.replace(window.location.href.replace(new RegExp("signup$"), ''));
				} else {
					if (res) {
						toast.error('Please use an email that ends with "@brown.edu"', {
							position: "bottom-left",
							autoClose: 5000,
							hideProgressBar: false,
							closeOnClick: true,
							pauseOnHover: true,
							draggable: true,
							progress: undefined,
							theme: "colored",
						});
					} else {
						toast.error("Account creation unsuccessful, check your network connection!", {
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
				}
			} else if (typeof res == "boolean") {
				// Unauthenticated due to not completing or failing authentication
				toast.error('Authentication error: Please complete authentication!', {
					position: "bottom-left",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
					});
			} else {
				toast.info("Your account already exists! Logging you in...", {
					position: "bottom-left",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
					});
				router.push("/matches")
			}
		}
	}

	return (
		<main className={"grow flex flex-col justify-center w-screen text-orange-900 md:pt-8 pb-14"}>
			<div className="w-full md:w-2/3 mx-auto rounded-lg bg-transparent md:bg-orange-200 p-5 flex flex-col text-lg lg:text-xl">
				<div className="w-full text-center text-2xl lg:text-3xl mb-3">
					Answer these 9 questions to start matching!
				</div>
				<div className="w-full text-center text-lg lg:text-xl mb-6">
				Note: Try to use as FEW words as possible!
				</div>

				{
					questions.map((question: QuestionWithExamples, i: number) => {
						return (
						<div
						key={i}
						className="mb-6 w-2/3 h-1/6 mx-auto md:font-normal font-bold">
							<label className="mb-2">{question.q}</label>
							<input type="text" className="w-full rounded-md px-3 py-1 font-normal"
							onChange={(e) => {
								setMap(question.q, e.currentTarget.value);
							}}
							placeholder={"Ex: " + question.example}/>
						</div>)
					})
				}

				<div className="mb-6 w-2/3 h-1/6 mx-auto md:font-normal font-bold">
					<label className="mb-2">Finally, what&apos;s your name?</label>
					<input type="text" className="w-full rounded-md px-3 py-1 font-normal"
					onChange={(e) => {
						setName(e.currentTarget.value);
					}}
					placeholder={"Nice to meet you!"}/>
				</div>

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