import { AuthState, useAuth } from "@/utils/firebaseFunctions";
import Link from "next/link";

export default function Home() {
  const auth: AuthState = useAuth();
  return (
    <main className={"grow flex flex-col justify-center "}>
      {/* <div className="text-orange-900 font-semibold text-4xl mx-auto mb-6 italic">
        WELCOME TO CUBBY
      </div> */}
      <img
          src="/imgs/CubbyBearWithLogo.png"
          className="w-1/2 mx-auto mb-3 object-cover object-center"
        />
      {/* <div className="h-1/2 w-1/2 mx-auto mb-3 overflow-visible">
        
      </div> */}
      <div className="mx-auto text-orange-900 text-lg">
        {auth.isAuthenticated ? (
          <Link href="/matches">
            Start matching <span>&#8594;</span>
          </Link>
        ) : (
          <Link href="/signup">
            Start matching <span>&#8594;</span>
          </Link>
        )}
      </div>
    </main>
  );
}
