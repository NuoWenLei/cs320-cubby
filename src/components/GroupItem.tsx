import { Group } from "@/utils/types";

export default function GroupItem(
	{ group } : { group: Group }
) {
	return (
		<div className={"flex flex-row p-2"}>
			<div className={"lg:w-16 hidden lg:flex h-16 w-16 overflow-hidden " + (group.friend_group ? " rounded-full " : " rounded-lg ")}>
				<img
				className="h-full w-full object-cover object-center"
				src={group.friend_group ?
					"/friend_groups.png"
					: "/community.png"
				}/>
			</div>
			<div className="w-full lg:w-3/4 flex flex-col ml-1 md:ml-4 mt-2 text-ellipsis overflow-hidden">
				<div className="text-orange-900 text-base md:text-xl font-bold">
					{ group.name ? group.name : "No name"}
				</div>
				<div className="text-orange-900 text-xs md:text-base">
					<span className="hidden xl:inline">Number of members:</span>
					<span className="xl:hidden">Members:</span>
					 &nbsp;{ group.member_ids ? group.member_ids.length : 0}
				</div>
			</div>
		</div>
	)
}