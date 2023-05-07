import ResultCard from "@/components/ResultCard";
import Searchbar from "@/components/Searchbar";
import { API_URL } from "@/utils/constants";
import { AuthState, useAuth } from "@/utils/firebaseFunctions";
import { getAllInterestGroups, getGroupsfromGID } from "@/utils/firebaseReadFunctions";
import { addUserToGroup } from "@/utils/firebaseWriteFunctions";
import { Group, InterestSearchResult } from "@/utils/types";
import { Dialog } from "@headlessui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Communities() {
	const [groupResults, setGroupResults] = useState<Group[]>([]);
	const [openedId, setOpenedId] = useState<number>(-1);
	const [inputState, setInputState] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

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
			initInterestGroupQuery();
		}
	}, [auth]);

	async function initInterestGroupQuery() {
		const allInterestGroups: Group[] = await getAllInterestGroups();
		setGroupResults(allInterestGroups);
	}

	async function getQueryResults(q: string) {
		const queryUrl = `${API_URL}/interestSearch?q=${q}`;
		return await fetch(queryUrl, {
			method: "GET",
			headers: {
				"Access-Control-Allow-Origin": "*"
			}
		});
	}

	async function searchFunc(q: string) {
		setLoading(true);
		getQueryResults(q).then(res => res.json()).then(
			async (results: InterestSearchResult) => {
				const interestGroups: Group[] = await getGroupsfromGID(results.ordered_ids);
				setGroupResults(interestGroups);
				setLoading(false);
			})
			.catch((_) => {
				toast.error("API query error, please check your network!",
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
				setLoading(false);
			});
	}

	async function joinGroup(group_id: string | undefined, user_id: string) {
		if (group_id == undefined) {
			return false;
		}

		const status = await addUserToGroup(group_id, user_id);

		return status;
	}

	return (
		<main className={"grow flex flex-col justify-center text-orange-900"}>
			<div className="w-11/12 md:w-1/2 mx-auto my-10">
			<Searchbar searchFunc={searchFunc} inputState={inputState} setInputState={setInputState} loading={loading}/>
			</div>
			<div className="grow flex flex-row flex-wrap w-11/12 h-80 mx-auto justify-center overflow-y-scroll mb-8">
				{
					groupResults.map((group: Group, index: number) => {
						return (
						<ResultCard
						key={index}
						interestGroup={group}
						user_id={auth.user?.id ? auth.user.id : ""}
						elem_id={index}
						opened_id={openedId}
						set_opened_id={setOpenedId}
						join_group={joinGroup}
						/>
						)
					})
				}
			</div>
		</main>
	)
}