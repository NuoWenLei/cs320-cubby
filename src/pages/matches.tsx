import MatchInterface from "@/components/MatchInterface";
import Matchbar from "@/components/Matchbar";

import { useState } from "react";

export default function Matches() {
	const [index, setIndex] = useState<number>(-1);
	return (
		<main className={"grow flex flex-col justify-center w-screen"}>
			<div className="flex flex-col mx-14 lg:mx-20">
				<MatchInterface />
			<Matchbar index={index} setIndex={setIndex} items={[1,2,3,1,2,2,1,1,1,1,2,2,2,3]}/>
			</div>
		</main>
	)
}