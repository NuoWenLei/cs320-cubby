import { Group } from "@/utils/types";

interface ResultCardProp {
	interestGroup: Group;
	user_id: string; // For checking if user is already in group
}

export default function ResultCard(
	{ interestGroup } : ResultCardProp
) {

	// auth
	return (
		<div className="h-60 w-80 m-4 bg-transparent border-2 border-orange-900">
			
		</div>
	)
}