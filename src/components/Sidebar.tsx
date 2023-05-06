import { Group } from "@/utils/types";
import GroupItem from "./GroupItem";
import { useState } from "react";

interface SidebarProps {
	index: number | undefined;
	setIndex: (arg: number | undefined) => void;
	items: Group[]
}

export default function Sidebar(
	{ index, setIndex, items } : SidebarProps
) {

	const [friendBar, setFriendBar] = useState<boolean>(true);

	return (
		<div className="grow flex flex-col py-5">
			<div className="flex flex-row justify-center text-orange-900 text-3xl mb-4">
				Groups
			</div>
			<div className="flex flex-row w-full text-white justify-around">
				<button type="button" className={"p-2 m-2 rounded-full border border-2 border-orange-900 "
				+ ((friendBar) ? "bg-orange-900" : "bg-transparent")}
				onClick={() => setFriendBar(true)}>
					Friend Groups
				</button>
				<button type="button" className={"p-2 m-2 rounded-full border border-2 border-orange-900 "
				+ ((!friendBar) ? "bg-orange-900" : "bg-transparent")}
				onClick={() => setFriendBar(false)}>
					Communities
				</button>
			</div>
			{
				items.filter((group: Group) => group.friend_group == friendBar).map((g: Group, i: number) => {
					return (
						<div
						key={i}
						onClick={() => setIndex(i)}
						className={"cursor-pointer m-2 mb-3 rounded-md border border-2 "
						+ ((index == i) ? "border-orange-900" : "border-transparent")}>
							<GroupItem group={g}/>
						</div>
					)
				})
			}
		</div>
	)
}