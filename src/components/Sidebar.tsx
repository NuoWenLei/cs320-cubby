import { Group } from "@/utils/types";
import GroupItem from "./GroupItem";
import { useState } from "react";

interface SidebarProps {
	selectedGroup: Group | undefined;
	setSelectedGroup: (arg: Group | undefined) => void;
	items: Group[]
}

export default function Sidebar(
	{ selectedGroup, setSelectedGroup, items } : SidebarProps
) {

	const [friendBar, setFriendBar] = useState<boolean>(true);

	return (
		<div className="grow flex flex-col py-5">
			<div className="flex flex-row justify-center text-orange-900 text-lg font-semibold lg:text-3xl mb-4">
				Groups
			</div>
			<div className="flex flex-col xl:flex-row w-full text-white justify-around text-xs lg:text-base">
				<button type="button" className={"p-2 m-2 rounded-full "
				+ ((friendBar) ? "bg-orange-700" : "bg-orange-900")}
				onClick={() => 
				{
					setFriendBar(true)

				}}>
					<span className="hidden md:inline">Friend Groups</span>
					<span className="md:hidden">Friends</span>
				</button>
				<button type="button" className={"p-2 m-2 rounded-full truncate "
				+ ((!friendBar) ? "bg-orange-700" : "bg-orange-900")}
				onClick={() => setFriendBar(false)}>
					Communities
				</button>
			</div>
			{
				items.filter((group: Group) => group.friend_group == friendBar).map((g: Group, i: number) => {
					return (
						<div
						key={i}
						onClick={() => setSelectedGroup(g)}
						className={"cursor-pointer m-2 mb-3 rounded-md "
						+ (( (selectedGroup?.id ? selectedGroup.id : null) == g.id) ? "bg-orange-100" : "bg-transparent")}>
							<GroupItem group={g}/>
						</div>
					)
				})
			}
		</div>
	)
}