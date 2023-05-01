import { Group, User } from "@/utils/types";

interface GroupInterfaceProps {
	group: Group;
	userMap: {[key: string]: User}
}

export default function GroupInterface(
	{ group, userMap } : GroupInterfaceProps
) {
	return (
		<div className="flex flex-col h-full m-20">
			<div className="text-4xl mb-3 mx-auto">
				{group.id}
			</div>
			<div className="text-2xl w-full text-center mb-3">
						Matching Distribution
			</div>
			<div className="text-md text-xl w-full text-center flex flex-row flex-wrap justify-center mb-4 w-1/3 mx-auto">
				{
					group.feature_dist ? (group.feature_dist.map((percent: number, i: number) => {
						return (
						<>
							<div key={"expanded-" + i} className="mr-4 min-[423px]:flex hidden lg:mx-auto"> Question {i + 1}: {(percent * 100.).toFixed(1)}%</div>
							<div key={"minimized-" + i} className="mr-4 flex min-[423px]:hidden"> Q{i + 1}: {(percent * 100.).toFixed(1)}%</div>
						</>
						)
					})) : (
							<div className="mr-4 min-[423px]:flex hidden lg:mx-auto">
								No feature distribution for this group.
								</div>
						)
				}
			</div>
			<div className="text-2xl mb-3 mx-auto">
				Members:
			</div>
			<div className="flex flex-col mx-auto">
				{
					group.member_ids == undefined ? "None" :
					group.member_ids.map((user_id: string) => {
						let user = userMap[user_id];
						if (user == undefined) {
							return (
								<></>
							)
						}
						return (<div className={"flex flex-row p-2"}>
						<div className="h-20 w-20 overflow-hidden rounded-full">
							<img
							className="h-full, w-full object-cover object-center"
							src="https://beyondsweetandsavory.com/wp-content/uploads/2022/02/Korean-fried-chicken-wings-VyTran-7.jpg"/>
						</div>
						<div className="flex flex-col ml-4 mt-2">
							<div className="text-orange-900 text-xl">
								{ user.name ? user.name : "Anonymous"}
							</div>
							<div className="text-orange-900">
								{ user.email ? user.email : "No email"}
							</div>
						</div>
					</div>)
					})
				}
			</div>
		</div>
	)
}