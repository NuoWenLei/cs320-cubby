import GroupInterface from "@/components/GroupInterface";
import Sidebar from "@/components/Sidebar";
import { AuthState, useAuth } from "@/utils/firebaseFunctions";
import { getUserGroups } from "@/utils/firebaseReadFunctions";
import { Group } from "@/utils/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Group() {
	const [groups, setGroups] = useState<Group[]>([]);
	const [index, setIndex] = useState<number | undefined>(undefined);

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
			initUserGroups();
		}
	}, [auth]);

	async function initUserGroups() {
		if (auth.user?.id != undefined) {
			const res = await getUserGroups(auth.user.id);
			setGroups(res);
		} 
	}

	return (
		<main className={"grow flex flex-row divide-x-2 divide-orange-800"}>
			<div className="flex flex-col basis-1/4">
				{
					groups.length > 0 ?
					<Sidebar index={index} setIndex={setIndex} items={groups}/> : null
				}
			</div>
			<div className="basis-3/4 flex flex-col text-orange-900">
				{
					index != undefined ?
					<GroupInterface group={groups[index]}/> : null
				}
			</div>
		</main>
	)
}