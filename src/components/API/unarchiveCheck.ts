export async function unarchiveCheck(id: number): Promise<void> {
    await fetch("http://localhost:8000/unarchiveCheck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
    });
}