import ResultCard from "@/components/ResultCard";
import Searchbar from "@/components/Searchbar";

export default function Communities() {
	async function searchFunc() {}
	return (
		<main className={"grow flex flex-col justify-center text-orange-900"}>
			<div className="w-11/12 md:w-1/2 mx-auto my-10">
			<Searchbar searchFunc={searchFunc}/>
			</div>
			<div className="grow flex flex-row flex-wrap w-4/5 mx-auto justify-center">
				<ResultCard />
				<ResultCard />
				<ResultCard />
				<ResultCard />
				<ResultCard />
				<ResultCard />
				<ResultCard />
				<ResultCard />

			</div>
			
		</main>
	)
}