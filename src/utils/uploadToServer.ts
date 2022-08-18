export default async function uploadToServer(file: File, onError: (error: string) => void): Promise<null | string> {
  const body = new FormData();
  body.append("file", file);
  const response = await fetch("/api/files", {
    method: "POST",
    body,
  });

  const data = await response.json();

  if (data.status === "error") {
    onError("Greška prilikom učitavanja datoteke, molimo pokušajte ponovo");
    return null;
  }

  return data.file.id as string;
}
