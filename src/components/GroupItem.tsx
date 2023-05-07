import { Group } from "@/utils/types";

export default function GroupItem(
	{ group } : { group: Group }
) {
	return (
		<div className={"flex flex-row p-2"}>
			<div className={"hidden lg:flex h-16 w-16 overflow-hidden " + (group.friend_group ? " rounded-full " : " rounded-lg ")}>
				<img
				className="h-full w-full object-cover object-center"
				src={group.friend_group ?
					"/friend_groups.png"
					: "/community.png"
				}/>
			</div>
			<div className="flex flex-col ml-1 md:ml-4 mt-2 text-ellipsis overflow-hidden">
				<div className="text-orange-900 text-base md:text-xl font-bold">
					{ group.name ? group.name : "No name"}
				</div>
				<div className="text-orange-900 text-xs md:text-base">
					<span className="hidden md:inline">Number of members:</span>
					<span className="md:hidden">Members:</span>
					 { group.member_ids ? group.member_ids.length : 0}
				</div>
			</div>
		</div>
	)
}