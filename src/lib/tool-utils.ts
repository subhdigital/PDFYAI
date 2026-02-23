export const processPDFJob = async (type: string, files: File[], payload: any = {}) => {
    // 1. Upload files locally
    const uploadedKeys = await Promise.all(
        files.map(async (file) => {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const { key } = await res.json();
            return key;
        })
    );

    // 2. Create Job
    const jobRes = await fetch("/api/jobs/create", {
        method: "POST",
        body: JSON.stringify({
            type,
            inputKey: uploadedKeys[0],
            payload: { ...payload, additionalKeys: uploadedKeys.slice(1) },
        }),
    });

    const data = await jobRes.json();
    const jobId = data.jobId;

    if (!jobId) {
        throw new Error(data.error || "Failed to initiate PDF job");
    }

    // 3. Poll for completion
    return new Promise<string>((resolve, reject) => {
        const interval = setInterval(async () => {
            try {
                const statusRes = await fetch(`/api/jobs/${jobId}`);
                const { status, downloadUrl, error } = await statusRes.json();

                if (status === "COMPLETED") {
                    clearInterval(interval);
                    resolve(downloadUrl);
                } else if (status === "FAILED") {
                    clearInterval(interval);
                    reject(new Error(error || "Processing failed"));
                }
            } catch (err) {
                clearInterval(interval);
                reject(err);
            }
        }, 2000);
    });
};
