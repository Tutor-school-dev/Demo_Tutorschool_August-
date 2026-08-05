import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-foreground">404 - Page Not Found</h1>
        <p className="text-muted-foreground max-w-md">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <Button asChild>
          <Link href="/">
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
}