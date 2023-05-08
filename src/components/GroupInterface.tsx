import { Group, User } from "@/utils/types";

interface GroupInterfaceProps {
	group: Group;
	userMap: {[key: string]: User};
	leaveGroup: (groupId: string | undefined, groupName: string | undefined) => Promise<void>;
}

export default function GroupInterface(
	{ group, userMap, leaveGroup } : GroupInterfaceProps
) {

	function isValidHttpUrl(string: string) {
		// https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
		let url;
		
		try {
		  url = new URL(string);
		} catch (_) {
		  return false;  
		}
	  
		return url.protocol === "http:" || url.protocol === "https:";
	  }

	return (
		<div className="flex flex-col h-full m-20">
			<div className="text-xl md:text-4xl mb-3 mx-auto font-bold text-center">
				{group.name}
			</div>
			{group.friend_group ?
			<>
			<div className="text-lg md:text-2xl w-full text-center mb-3">
						Matching Distribution
			</div>
			<div className="text-md md:text-xl text-center flex flex-row flex-wrap justify-center mb-4 w-1/3 mx-auto">
				{
					group.feature_dist ? (group.feature_dist.map((percent: number, i: number) => {
						return (
						<>
							<div key={"expanded-" + i} className="mr-4 md:flex hidden lg:mx-auto"> Question {i + 1}: {(percent * 100.).toFixed(1)}%</div>
							<div key={"minimized-" + i} className="mr-4 flex md:hidden"> Q{i + 1}: {(percent * 100.).toFixed(1)}%</div>
						</>
						)
					})) : (
							<div className="mr-4 min-[423px]:flex hidden lg:mx-auto">
								No feature distribution for this group.
								</div>
						)
				}
			</div>
			</>
			 :
			 <>
			 {
				isValidHttpUrl(group.interest_group_info?.community_link ? group.interest_group_info.community_link : "") ?
				<div className="text-lg md:text-2xl w-full text-center mb-3">
					<a href={group.interest_group_info?.community_link ? group.interest_group_info.community_link : "#"} className="text-blue-600 w-full" target="_blank">
						Community Link
					</a>
				</div> : 
				<div className="text-lg md:text-2xl w-full text-center mb-3">
					No Community Link
				</div>
			 }

			 </>
			}
			<div className="text-lg md:text-2xl mb-3 mx-auto">
				Members:
			</div>
			<div className="flex flex-col w-full mb-6">
				{
					group.member_ids == undefined ? "None" :
					group.member_ids.map((user_id: string) => {
						let user = userMap[user_id];
						if (user == undefined) {
							return (
								<></>
							)
						}
						return (<div className={"flex flex-row p-2 justify-start w-5/6 lg:w-4/5 xl:w-2/3 lg:ml-auto overflow-x-hidden"} key={user_id}>
						<div className="hidden md:flex h-20 w-20 overflow-hidden rounded-full">
							<img
							className="h-full, w-full object-cover object-center"
							src="/profile.png"/>
						</div>
						<div className="flex flex-col ml-4 mt-2 w-24 md:w-60 lg:w-fit">
							<div className="text-orange-900 text-base md:text-xl">
								{ user.name ? user.name : "Anonymous"}
							</div>
							<div className="text-orange-900 text-sm md:text-base overflow-x-hidden text-ellipsis">
								{ user.email ? user.email : "No email"}
							</div>
						</div>
					</div>)
					})
				}
			</div>
			<div className="flex flex-row justify-center w-full">
				<button type="button"
				className="px-4 py-2 bg-rose-700 text-white text-center text-xl rounded-lg"
				onClick={() => leaveGroup(group.id, group.name)}>
					LEAVE
				</button>
			</div>
		</div>
	)
}