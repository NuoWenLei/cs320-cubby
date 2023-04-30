import { Group } from "@/utils/types";

export default function GroupInterface(
	{ group } : { group: Group }
) {
	return (
		<div>
			{group.id}
		</div>
	)
}