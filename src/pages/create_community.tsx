import { AuthState, useAuth } from '@/utils/firebaseFunctions';
import { addInterestGroupApplication } from '@/utils/firebaseWriteFunctions';
import { Group } from '@/utils/types';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const applicationQuestions = [
	{
		q: "COMMUNITY LINK (EX: DISCORD LINK), PUT N/A IF NONE",
		name: "community_link",
		classes: "w-full md:w-1/2",
		useInput: true,
	},
	{
		q: "COMMUNITY MISSION",
		name: "mission",
		classes: "h-40 w-full md:w-3/4",
		useInput: false,
	}
]

export default function CreateCommunity() {

	const [answerMap, setAnswerMap] = useState<{[key: string] : string}>({});
	const [communityName, setCommunityName] = useState<string>("");

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
		}
	}, [auth]);

	function emptinessCheck() {
		let valid = true;
		for (var question of applicationQuestions) {
			if (!(question.name in answerMap)) {
				valid = false;
			} else if (answerMap[question.name].trim().length == 0) {
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

	function setMap(k: string, v: string) {
		let map = { ...answerMap};
		map[k] = v;
		setAnswerMap(map);
	}

	function constructGroupObject(user_id: string) {
		let map: Group = {};
		map["name"] = communityName;
		map["founder_id"] = user_id
		map["friend_group"] = false;
		map["interest_group_info"] = {...answerMap}
		map["member_ids"] = [user_id]
		return map;
	}

	async function sendCreateRequest() {
		const validity = emptinessCheck();

		if (!validity) {
			return;
		}

		if (communityName.trim().length == 0) {
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

		if (auth.user?.id != undefined) {

			const groupObject: Group = constructGroupObject(auth.user.id);
			const res = await addInterestGroupApplication(groupObject);

			if (typeof res != "string") {
				toast.error("Application submission errored!",
				{
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
				toast.success("Application submitted!",
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
				router.replace("/profile")
			}
		} else {
			unauthenticatedRedirect();
		}
	}

	return (
		<main className={"grow flex flex-col justify-start text-black italic p-20"}>
			<div className="text-2xl md:text-4xl font-semibold mb-6">
				CREATE YOUR OWN COMMUNITY
			</div>
			<div className="text-sm md:text-lg flex flex-col mb-4">
				<div
					className="mb-3 bg-transparent flex flex-col">
						<label className="italic">
							NAME
						</label>
						<input type="text"
						className={"bg-gray-200 rounded-md p-2 w-full md:w-1/2"}
						onChange={
							(e) => setCommunityName(e.target.value)
						}/>
				</div>
				{
					applicationQuestions.map((question, index: number) => {
						return (
							<div
							key={index}
							className="mb-3 bg-transparent flex flex-col">
								<label className="italic">
									{question.q}
								</label>
								{
									question.useInput ? 
									(<input type="text"
										className={"bg-gray-200 rounded-md p-2 " + question.classes}
										onChange={
											(e) => setMap(question.name, e.target.value)
										}/>)
										:
										(<textarea
										className={"bg-gray-200 rounded-md p-2 resize-none " + question.classes}
										onChange={
											(e) => setMap(question.name, e.target.value)
										}>
										</textarea>
										)
								}
							</div>
						)
					})
				}
			</div>
			<div className="w-full md:w-5/6 flex flex-row justify-center md:justify-end">
				<button type="button"
				className="text-2xl bg-orange-900 rounded-lg md:bg-transparent text-white md:text-black font-bold md:font-normal p-2"
				onClick={sendCreateRequest}>
				submit community request <TrendingFlatIcon className="hidden md:inline"/>
				</button>
				
			</div>
		</main>
	)
}