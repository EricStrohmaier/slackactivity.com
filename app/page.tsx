import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const clientId = process.env.NEXT_PUBLIC_SLACK_CLIENT_ID;
  const redirectUri = encodeURIComponent(
    "https://7979-178-115-78-210.ngrok-free.app/api/oauth"
  );
  const userScope = "users:write,users:read,users.profile:write";

  const linkOAuth = `https://slack.com/oauth/v2/authorize?scope=&user_scope=${userScope}&redirect_uri=${redirectUri}&client_id=${clientId}`;

  const imgSlackSignIn = "https://api.slack.com/img/sign_in_with_slack.png";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="App">
        <header className="App-header">
          <Link href={linkOAuth}>
            <Image
              src={imgSlackSignIn}
              alt="Sign in with Slack"
              width={200}
              height={40}
            />
          </Link>
        </header>
      </div>
    </main>
  );
}
