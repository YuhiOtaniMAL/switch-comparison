import express from "express";
import { getAccessToken } from "./auth";

process.loadEnvFile(".env");

const app = express();

app.get("/api/users/:login", async (req, res) => {
  const { login } = req.params;

  try {
    const token = await getAccessToken();
    const response = await fetch(
      `https://api.intra.42.fr/v2/users/${encodeURIComponent(login)}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(10_000),
      }
    );

    if (response.status === 404) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (!response.ok) {
      res.status(502).json({ error: "42 API returned an error" });
      return;
    }

    const data = await response.json();
    res.json(data);
  } catch {
    res.status(502).json({ error: "Failed to reach 42 API" });
  }
});

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
