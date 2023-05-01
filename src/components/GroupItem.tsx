import { Group } from "@/utils/types";

export default function GroupItem(
	{ group } : { group: Group }
) {
	return (
		<div className={"flex flex-row p-2"}>
			<div className="h-20 w-20 overflow-hidden rounded-full">
				<img
				className="h-full, w-full object-cover object-center"
				src="https://i.pinimg.com/564x/41/ba/a5/41baa5aad410777da19ae9116e7aa086--bear-cubs-baby-bears.jpg"/>
			</div>
			<div className="flex flex-col ml-4 mt-2">
				<div className="text-orange-900 text-xl">
					{ group.id ? group.id : "No ID"}
				</div>
				<div className="text-orange-900">
					Number of members: { group.member_ids ? group.member_ids.length : 0}
				</div>
			</div>
		</div>
	)
}