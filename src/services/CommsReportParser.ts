import Papa from "papaparse";

export type DashboardCounts = {
    [key: string]: number;
};

export const parseCsvData = (file: File): Promise<DashboardCounts> => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            transform: (value) => value.trim(),
            complete: (results) => {
                const counts: DashboardCounts = {};
                const channelMap: Record<string, string> = {
                    DP: "Dealer Portal",
                    FORDPASS: "FordPass",
                    OWNERWEB: "Owner Web",
                    TIER3DEALERWEB: "Tier3",
                };

                results.data.forEach((row: any) => {
                    const source = channelMap[row["ChannelType"]?.toUpperCase()];
                    const isText = String(row["IsTextCommunication"]).toLowerCase() === "true";
                    const isEmail = String(row["IsEmailCommunication"]).toLowerCase() === "true";

                    if (source) {
                        let type = "No Comms";

                        if (isText && isEmail) type = "Email & Text";
                        else if (isText) type = "Text Only";
                        else if (isEmail) type = "Email Only";

                        const key = `${source}-${type}`;
                        counts[key] = (counts[key] || 0) + 1;
                    }
                });
                resolve(counts);
            },
            error: (error) => reject(error),
        });
    });
};

export const exportDashboardData = (
    month: string,
    metrics: { title: string; subtitle: string; value: string }[],
    totals: Record<string, string>,
    percentages: Record<string, string>
) => {
    let csvContent = "Category,Metric,Value\n";

    csvContent += "KEY METRICS,,\n";
    metrics.forEach(m => {
        const cleanValue = m.value.replace(/,/g, '');
        csvContent += `"${m.title}","${m.subtitle}",${cleanValue}\n`;
    });

    csvContent += "\nTOTALS,,\n";
    Object.entries(totals).forEach(([key, val]) => {
        csvContent += `Total,${key.toUpperCase()},${val.replace(/,/g, '')}\n`;
    });

    csvContent += "\nPERCENTAGES,,\n";
    Object.entries(percentages).forEach(([key, val]) => {
        csvContent += `Percentage,${key.toUpperCase()},${val}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Dashboard_Report_${month.replace(/\s+/g, '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};