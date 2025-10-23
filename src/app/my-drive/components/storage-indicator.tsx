"use client";

import { useEffect, useState } from "react";
import { Progress } from "~/components/ui/progress";
import { Cloud } from "lucide-react";

interface StorageData {
    userStorageUsed: number;
}

export function StorageIndicator({ variant }: { variant: "desktop" | "mobile" }) {
    const [userStorageUsed, setUserStorageUsed] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    const totalStorage = 50 * 1024 * 1024; // 50 MB

    useEffect(() => {
        const fetchUsageData = async () => {
            try {
                const response = await fetch("/api/storage");
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                const data = await response.json() as StorageData;
                setUserStorageUsed(data.userStorageUsed);
            } catch (error) {
                console.error("Failed to fetch storage data", error);
            } finally {
                setLoading(false);
            }
        };

        void fetchUsageData();
    }, []);

    if (loading) {
        return (
            <div className="space-y-2">
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <Cloud className="h-4 w-4" />
                    <span>Loading...</span>
                </div>
                <Progress value={0} className="h-2" />
                <p className="text-muted-foreground text-xs">Loading storage...</p>
            </div>
        );
    }

    const usedMB = (userStorageUsed / (1024 * 1024)).toFixed(1);
    const totalMB = 50;
    const usagePercentage =
        totalStorage > 0 ? (userStorageUsed / totalStorage) * 100 : 0;

    if (variant === "desktop") {
        return (
            <div className="space-y-2">
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <Cloud className="h-4 w-4" />
                    <span>Storage</span>
                </div>
                <Progress value={usagePercentage} className="h-2" />
                <p className="text-muted-foreground text-xs">{`${usedMB} MB of ${totalMB} MB used`}</p>
            </div>
        );
    }

    if (variant === "mobile") {
        return (
            <div className="text-muted-foreground flex flex-col items-center justify-center gap-1.5 text-[10px]">
                <Cloud className="h-3.5 w-3.5" />
                <span>{`${usedMB} MB / ${totalMB} MB`}</span>
            </div>
        );
    }

    return null;
}
