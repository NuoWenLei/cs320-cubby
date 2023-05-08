import GroupInterface from "@/components/GroupInterface";
import Sidebar from "@/components/Sidebar";
import { AuthState, useAuth } from "@/utils/firebaseFunctions";
import { getAllUsersFromGroups, getUserGroups } from "@/utils/firebaseReadFunctions";
import { userLeaveGroup } from "@/utils/firebaseWriteFunctions";
import { Group, User } from "@/utils/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Group() {
	const [groups, setGroups] = useState<Group[]>([]);
	const [userMap, setUserMap] = useState<{[key: string]: User}>({});
	const [selectedGroup, setSelectedGroup] = useState<Group | undefined>(undefined);

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
			const userMapRes = await getAllUsersFromGroups(res);
			setUserMap(userMapRes);
		} 
	}

	async function leaveGroup(groupId: string | undefined, groupName: string | undefined) {
		if (groupId == undefined) {
			return;
		}
		if (auth.user?.id != undefined) {
			const res = await userLeaveGroup(auth.user.id, groupId);
			if (res) {
				toast.info(`You have left the group ${groupName}!`,
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
				router.replace("/profile");
			} else {
				toast.info(`API Error: Unable to leave groups`,
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
			}
		} 
		
	}

	return (
		<main className={"grow flex flex-row"}>
			<div className="flex flex-col w-1/4">
				{
					groups.length > 0 ?
					<Sidebar selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup} items={groups}/> : null
				}
			</div>
			<div className="w-3/4 flex flex-col text-orange-900 bg-white">
				{
					selectedGroup != undefined ?
					<GroupInterface group={selectedGroup} userMap={userMap} leaveGroup={leaveGroup}/> : null
				}
			</div>
		</main>
	)
}