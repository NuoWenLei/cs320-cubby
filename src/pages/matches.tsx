import MatchInterface from "@/components/MatchInterface";
import Matchbar from "@/components/Matchbar";
import { AuthState, useAuth } from "@/utils/firebaseFunctions";
import { getGroupsfromGID, getInvitationsOfUser } from "@/utils/firebaseReadFunctions";
import { addUserToGroup, changeInvitationStatus } from "@/utils/firebaseWriteFunctions";
import { Group, Invitation } from "@/utils/types";
import { useRouter } from "next/router";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface GroupMap {
	[key: string]: Group
}

export default function Matches() {
	const [index, setIndex] = useState<number>(0);
	const [invitations, setInvitations] = useState<Invitation[]>([]);
	const [groups, setGroups] = useState<GroupMap>({});
	const [loading, setLoading] = useState<boolean>(true);

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
			initQueryGroupsAndInvites();
		}
	}, [auth]);

	/*
	User-defined type guard for string.

	Inspiration source: https://www.benmvp.com/blog/filtering-undefined-elements-from-array-typescript/
	*/
	const isString = (item: string | undefined): item is string => {
		return !!item
	  }

	async function initQueryGroupsAndInvites() {
		if (auth.user?.id != undefined) {
			let invites = await getInvitationsOfUser(auth.user?.id, "pending")
			const groupIDs: string[] = invites.map((item: Invitation) => item.group_id).filter(isString)
			const queriedGroups = await getGroupsfromGID(groupIDs)

			invites.sort((a: Invitation, b: Invitation) => {
				if ((a.similarity_matched != undefined) && (b.similarity_matched != undefined)) {
					return b.similarity_matched - a.similarity_matched;
				}
				return 0;
			})

			let newGroupMap: GroupMap = {};

			for (var group of queriedGroups) {
				if (group.id != undefined) {
					newGroupMap[group.id] = group;
				}
			}

			setInvitations(invites)
			setGroups(newGroupMap)
			setLoading(false);
		}
	}

	function errorMessage(msg: string | undefined = undefined) {
		const message = (msg == undefined) ? "Something went wrong" : `Something went wrong: ${msg}`
		toast.error(message, {
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

	async function joinGroup(group_id: string | undefined, invitation_id: string | undefined) {
		if (group_id == undefined) {
			errorMessage("Unidentifiable group");
			return;
		}

		if (invitation_id == undefined) {
			errorMessage("Unidentifiable invitation");
			return;
		}

		if (auth.user?.id == undefined) {
			auth.signOut();
			unauthenticatedRedirect();
			return;
		}

		const res = await addUserToGroup(group_id, auth.user.id);

		if (!res) {
			errorMessage("Likely due to network connection");
			return;
		}

		const inviteRes = await changeInvitationStatus(invitation_id, "accepted");

		if (inviteRes) {
			toast.success("You have joined the group!", {
				position: "bottom-left",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});
			const filteredInvites = [...invitations].filter((value: Invitation) => (value.id != invitation_id))
			setInvitations(filteredInvites)
		} else {
			errorMessage("Likely due to network connection");
		}
	}

	async function rejectGroup(invitation_id: string | undefined) {
		if (invitation_id == undefined) {
			errorMessage("Unidentifiable invitation");
			return;
		}

		if (auth.user?.id == undefined) {
			auth.signOut();
			unauthenticatedRedirect();
			return;
		}

		const inviteRes = await changeInvitationStatus(invitation_id, "denied");

		if (inviteRes) {
			toast.info("You have rejected the invite!", {
				position: "bottom-left",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});
			const filteredInvites = [...invitations].filter((value: Invitation) => (value.id != invitation_id))
			setInvitations(filteredInvites)
		} else {
			errorMessage("Likely due to network connection");
		}
	}

	function getCurrentGroup() {
		const invite = invitations[index];
		if (invite.group_id == undefined) {
			return {}
		} else {
			return groups[invite.group_id]
		}
	}
	
	return (
		<main className={"grow flex flex-col justify-center w-screen"}>
			{loading ? null : 
			(<>
				{(invitations.length > 0) ?
				(<div className="flex flex-col mx-14 lg:mx-20">
					<MatchInterface
					invite={invitations[index]}
					group={getCurrentGroup()}
					joinGroup={joinGroup}
					rejectGroup={rejectGroup}/>
					<Matchbar index={index} setIndex={setIndex} items={invitations}/>
				</div>) : <div className="text-center mx-auto text-2xl lg:text-6xl text-orange-900 w-2/3">You have no more pending matches today, please wait till tomorrow for new matches!</div>
				}
			</>)
			}
			
		</main>
	)
}