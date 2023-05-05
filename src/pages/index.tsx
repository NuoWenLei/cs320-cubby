import { AuthState, useAuth } from "@/utils/firebaseFunctions";
import Link from "next/link";

export default function Home() {
  const auth: AuthState = useAuth();
  return (
    <main className={"grow flex flex-col justify-center "}>
      <div className="text-orange-900 font-semibold text-4xl mx-auto mb-3">
        Welcome to Cubby!
      </div>
      <div className="h-80 w-80 mx-auto mb-3">
        <img
          src="/imgs/CubbyBearWithLogo.png"
          className="h-full w-full object-cover object-center"
        />
      </div>
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
