import Sidebar from "@/components/Sidebar";

export default function Group() {
	return (
		<main className={"grow flex flex-row divide-x-2 divide-orange-800"}>
			<div className="flex flex-col basis-1/5">
				<Sidebar />
			</div>
			<div className="basis-4/5 flex flex-col">
				yoyoyo
			</div>
		</main>
	)
}