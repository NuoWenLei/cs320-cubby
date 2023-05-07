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

				if (name.trim().length == 0) {
					toast.error("Please enter a name!",
					{
						position: "bottom-left",
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
						theme: "colored",
					});
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
			<div className="w-full text-center text-4xl italic font-semibold mb-3">
				CUBBY MATCH
			</div>
			<div className="text-center text-lg italic mb-6">
				answer in a few words to start matching 
			</div>
			<div className="w-full flex flex-wrap justify-center mb-6 text-sm md:text-base">
			{
					questions.map((question: QuestionWithExamples, i: number) => {
						return (
						<div
						key={i}
						className="mx-4 my-2 w-40 md:w-60 xl:w-1/4  font-semibold bg-orange-100 rounded-lg p-4 flex flex-col justify-between">
							<label className="mb-2">{question.q}</label>
							<input type="text" className="w-full rounded-md px-3 py-1 font-normal bg-orange-300 text-orange-900"
							onChange={(e) => {
								setMap(question.q, e.currentTarget.value);
							}}/>
						</div>)
					})
				}
				<div
					className="mx-4 my-2 w-40 md:w-60 xl:w-1/4  font-semibold bg-orange-100 rounded-lg p-4 flex flex-col justify-between">
					<label className="mb-2">Finally, what&apos;s your name?</label>
						<input type="text" className="w-full rounded-md px-3 py-1 font-normal bg-orange-300 text-orange-900"
						onChange={(e) => {
							setName(e.currentTarget.value);
						}}/>
				</div>

			</div>
			<div className="w-full flex flex-row justify-center mb-8">
					<button className="px-6 py-3 bg-orange-900 text-white font-semibold rounded-lg" type="button"
					onClick={callSignup}>
						Sign Up with Google
						</button>
			</div>
		</main>
	)
}