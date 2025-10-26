"use client";

import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";

const LATENCY_COOKIE_NAME = "latency-warning-dismissed";

export function LatencyWarningBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${LATENCY_COOKIE_NAME}=`));

    if (!cookieValue) {
      setVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    document.cookie = `${LATENCY_COOKIE_NAME}=true; expires=${date.toUTCString()}; path=/`;
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="bg-card fixed right-4 bottom-4 z-50 max-w-sm rounded-lg border p-4 shadow-lg">
      <div className="flex flex-col space-y-2">
        <h3 className="font-semibold">A quick note on performance</h3>
        <p className="text-muted-foreground text-sm">
          The database is hosted in US-East using Singlestore. If you are
          located far away, you will experience some latency. My bad 🙃
        </p>
        <Button onClick={handleDismiss} className="self-end">
          Got it
        </Button>
      </div>
    </div>
  );
}
