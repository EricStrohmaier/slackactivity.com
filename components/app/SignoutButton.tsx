import { signOutAction } from "@/app/action";
import { Button } from "@/components/ui/button";

/**
 * Sign-out is a form posting to a server action, so it works without client
 * JavaScript and needs no auth SDK on the client.
 */
export default function SignoutButton() {
  return (
    <form action={signOutAction}>
      <Button variant="ghost" size="sm" type="submit" className="inline-flex">
        Sign Out
      </Button>
    </form>
  );
}
