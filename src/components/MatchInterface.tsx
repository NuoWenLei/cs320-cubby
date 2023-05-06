import { QuestionWithExamples, questions } from "@/utils/constants";
import { Group, Invitation } from "@/utils/types";
import { useState } from "react";

export interface MatchInterfaceProps {
	invite: Invitation;
	group: Group;
	joinGroup: ((arg1: string | undefined, arg2: string | undefined) => Promise<void>);
	rejectGroup: ((arg1: string | undefined) => Promise<void>);
	loading: boolean;
	setLoading: (arg: boolean) => void;
}

export default function MatchInterface(
	{ invite, group, joinGroup, rejectGroup, loading, setLoading } : MatchInterfaceProps
) {

	const requestJoin = async () => {
		setLoading(true);
		await joinGroup(group.id, invite.id);
		setLoading(false);
	}

	const requestReject = async () => {
		setLoading(true);
		await rejectGroup(invite.id);
		setLoading(false);
	}

	return (
		<div className="w-full flex flex-row mb-1">
			<div className="hidden md:flex md:flex-col md:basis-1/2">
				<div className="w-7/12 mx-auto">
					<div className="overflow-hidden rounded-full mb-4 h-52 w-52 xl:h-96 xl:w-96">
						<img
						className="h-full w-full object-cover object-center"
						src={"/friend_groups.png"}/>
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
				<div className="w-full lg:w-11/12 xl:w-7/12 bg-white text-orange-900 px-8 py-6 rounded-xl flex flex-col">
					<div className="text-xl xl:text-3xl w-full text-center font-bold">
						Overview
					</div>
					<div className="text-xl text-center w-full flex flex-row justify-center">
						<span className="hidden sm:flex mr-2">Name: </span> {group.name}	
					</div>
					<div className="h-20 w-20 overflow-hidden rounded-full mb-3 mx-auto md:hidden">
						<img
						className="h-full w-full object-cover object-center"
						src={"/friend_groups.png"}/>
					</div>
					<div className="text-xl xl:text-2xl w-full text-center mb-3">
						<span className="text-4xl">{invite.similarity_matched ? ((invite.similarity_matched * 100.).toFixed(1)) : 0.}%</span> match
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
						<button type="button"
						disabled={loading}
						className="px-3 py-1 bg-orange-900 text-white rounded-md rounded-lg m-2"
						onClick={requestJoin}>JOIN GROUP</button>
						<button type="button"
						disabled={loading}
						className="px-3 py-1 bg-rose-700 text-white rounded-md rounded-lg m-2"
						onClick={requestReject}>DECLINE</button>
					</div>
				</div>
			</div>
		</div>
	)
}