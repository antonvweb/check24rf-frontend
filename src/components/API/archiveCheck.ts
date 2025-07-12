export async function archiveCheck(id: number): Promise<void> {
    await fetch("http://localhost:8000/archiveCheck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
    });
}