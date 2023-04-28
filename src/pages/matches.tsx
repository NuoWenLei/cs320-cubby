import MatchInterface from "@/components/MatchInterface";
import Matchbar from "@/components/Matchbar";
import { AuthState, useAuth } from "@/utils/firebaseFunctions";
import { useRouter } from "next/router";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Matches() {
	const [index, setIndex] = useState<number>(-1);

	const auth: AuthState = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!auth.isAuthenticated) {
			toast.error('Not authenticated yet, please sign up first!', {
				position: "bottom-left",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
				});
			router.replace("/signup");
		}
	}, [auth]);
	
	return (
		<main className={"grow flex flex-col justify-center w-screen"}>
			<div className="flex flex-col mx-14 lg:mx-20">
				<MatchInterface />
			<Matchbar index={index} setIndex={setIndex} items={[1,2,3,1,2,2,1,1,1,1,2,2,2,3]}/>
			</div>
		</main>
	)
}