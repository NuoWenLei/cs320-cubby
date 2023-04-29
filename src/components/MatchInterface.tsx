import { QuestionWithExamples, questions } from "@/utils/constants";
import { Group, Invitation } from "@/utils/types";

export interface MatchInterfaceProps {
	invite: Invitation;
	group: Group;
	joinGroup: ((arg1: string | undefined, arg2: string | undefined) => Promise<void>);
	rejectGroup: ((arg1: string | undefined) => Promise<void>);
}

export default function MatchInterface(
	{ invite, group, joinGroup, rejectGroup } : MatchInterfaceProps
) {

	const imageUrl = "https://www.restlesschipotle.com/wp-content/uploads/2022/08/Crispy-Oven-Baked-Chicken-Wings-feat2-500x500.jpg";

	return (
		<div className="w-full flex flex-row md:px-10 mb-2 xl:mb-4">
			<div className="hidden md:flex md:flex-col md:basis-1/2">
				<div className="w-7/12 mx-auto">
					<div className="overflow-hidden rounded-full mb-4">
						<img
						className="h-full w-full object-cover object-center"
						src={imageUrl}/>
					</div>
					<div className="flex flex-col lg:flex-row justify-center">
						<button type="button" className="p-2 bg-orange-900 text-white text-center text-xl rounded-lg m-2"
						onClick={
							() => {
								joinGroup(group.id, invite.id)
							}
						}>JOIN GROUP</button>
						<button type="button" className="p-2 bg-rose-700 text-white text-center text-xl rounded-lg m-2"
						onClick={
							() => {
								rejectGroup(invite.id)
							}
						}>DECLINE</button>
					</div>
				</div>
			</div>
			<div className="basis-full md:basis-1/2 px-6">
				<div className="w-full lg:w-11/12 xl:w-7/12 border-2 border-orange-900 text-orange-900 p-3 flex flex-col mx-auto">
					<div className="text-xl xl:text-3xl w-full text-center mb-3">
						Overview Cubs
					</div>
					<div className="h-20 w-20 overflow-hidden rounded-full mb-3 mx-auto md:hidden">
						<img
						className="h-full w-full object-cover object-center"
						src={imageUrl}/>
					</div>
					<div className="text-xl xl:text-4xl w-full text-center mb-3">
						<span className="text-4xl xl:text-6xl">{invite.similarity_matched ? ((invite.similarity_matched * 100.).toFixed(1)) : 0.}%</span> match
					</div>
					<div className="text-xl w-full text-center mb-3">
						matching distribution
					</div>
					<div className="text-md xl:text-lg w-full text-center flex flex-row flex-wrap lg:flex-col lg:flex-nowrap justify-center mb-3 md:mb-0">
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
					<div className="flex flex-col md:hidden text-md text-center justify-center">
						<button type="button" className="px-3 py-1 bg-orange-900 text-white rounded-md rounded-lg m-2"
						onClick={
							() => {
								joinGroup(group.id, invite.id)
							}
						}>JOIN GROUP</button>
						<button type="button" className="px-3 py-1 bg-rose-700 text-white rounded-md rounded-lg m-2"
						onClick={
							() => {
								rejectGroup(invite.id)
							}
						}>DECLINE</button>
					</div>
				</div>
			</div>
		</div>
	)
}