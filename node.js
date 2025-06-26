const express = require('express');
const cors = require('cors');
const ytdlp = require('yt-dlp-exec');

const app = express();
app.use(cors());

app.get("/get-audio", async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).send("Missing YouTube URL");

  try {
    const data = await ytdlp(videoUrl, {
      dumpSingleJson: true,
      extractAudio: true,
      audioFormat: "mp3",
      postprocessorArgs: ["-b:a", "128k"],
      preferFreeFormats: true
    });

    res.json({
      title: data.title,
      audioUrl: data.url
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to fetch audio");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ MetaTagFixer API running on port ${port}`);
});
