import simpleGit from "simple-git";
import { NextApiRequest, NextApiResponse } from "next";

const options = {
  baseDir: "/Users/gauravsharma/Desktop/personal/mantine",
  binary: "git",
  maxConcurrentProcesses: 6,
  trimmed: false,
};

const git = simpleGit(options);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;

  if (method === "POST") {
    // Access "hash" parameter from the URL
    // console.log(`Received POST request with hash: ${body.hash}`);

    // Access POST data from the body
    // console.log("POST Data:", body);

    await git.checkout(body.hash);

    res.status(200).json({
      message: `Successfully navigated to Message: ${body.message} with HASH: ${body.hash}`,
    });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
