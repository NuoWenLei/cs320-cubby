import { Group } from "@/utils/types";
import GroupItem from "./GroupItem";

interface SidebarProps {
	index: number | undefined;
	setIndex: (arg: number | undefined) => void;
	items: Group[]
}

export default function Sidebar(
	{ index, setIndex, items } : SidebarProps
) {
	return (
		<div className="grow flex flex-col py-5">
			<div className="flex flex-row justify-center text-orange-900 text-3xl mb-4">
				Groups
			</div>
			
			{
				items.map((g: Group, i: number) => {
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