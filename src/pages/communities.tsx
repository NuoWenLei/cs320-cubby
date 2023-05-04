import ResultCard from "@/components/ResultCard";
import Searchbar from "@/components/Searchbar";
import { API_URL } from "@/utils/constants";
import { AuthState, useAuth } from "@/utils/firebaseFunctions";
import { getAllInterestGroups, getGroupsfromGID } from "@/utils/firebaseReadFunctions";
import { Group, InterestSearchResult } from "@/utils/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Communities() {
	const [groupResults, setGroupResults] = useState<Group[]>([]);

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
		const queryUrl = `${API_URL}/friendMatches?q=${q}`;
		return await fetch(queryUrl, {
			method: "GET",
			headers: {
				"Access-Control-Allow-Origin": "*"
			}
		});
	}

	async function searchFunc(q: string) {
		const response = await getQueryResults(q);
		if (response.status == 200) {
			const results: InterestSearchResult = await response.json();
			const interestGroups: Group[] = await getGroupsfromGID(results.ordered_ids);
			setGroupResults(interestGroups);
		} else {
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
		}
	}

	return (
		<main className={"grow flex flex-col justify-center text-orange-900"}>
			<div className="w-11/12 md:w-1/2 mx-auto my-10">
			<Searchbar searchFunc={searchFunc}/>
			</div>
			<div className="grow flex flex-row flex-wrap w-4/5 mx-auto justify-center">
				{
					groupResults.map((group: Group, index: number) => {
						return (
						<div
						key={index}>
						<ResultCard interestGroup={group} user_id={auth.user?.id ? auth.user.id : ""}/>
						</div>
						)
					})
				}
			</div>
		</main>
	)
}