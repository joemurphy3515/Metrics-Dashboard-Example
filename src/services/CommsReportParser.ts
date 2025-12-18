import Papa from "papaparse";

export type DashboardCounts = {
    [key: string]: number;
};

export const parseCsvData = (file: File): Promise<DashboardCounts> => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const counts: DashboardCounts = {};

                const channelMap: Record<string, string> = {
                    DP: "Dealer Web",
                    FORDPASS: "FordPass",
                    OWNERWEB: "Owner Web",
                    TIER3DEALERWEB: "Tier3",
                };

                results.data.forEach((row: any) => {
                    const rawChannel = row["ChannelType"];
                    const source = channelMap[rawChannel];

                    const isText = String(row["IsTextCommunication"]).toLowerCase() === "true";
                    const isEmail = String(row["IsEmailCommunication"]).toLowerCase() === "true";

                    if (source) {
                        let type = "";
                        if (isText && isEmail) {
                            type = "Email & Text";
                        } else if (isText && !isEmail) {
                            type = "Text Only";
                        } else if (!isText && isEmail) {
                            type = "Email Only";
                        } else if (!isText && !isEmail) {
                            type = "No Comms";
                        }

                        if (type) {
                            const key = `${source}-${type}`;
                            counts[key] = (counts[key] || 0) + 1;
                        }
                    }
                });

                resolve(counts);
            },
            error: (error) => reject(error),
        });
    });
};