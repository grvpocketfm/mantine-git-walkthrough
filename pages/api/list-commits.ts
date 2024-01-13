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
  try {
    await await git.checkout("master");
    const { all, latest, total } = await git.log();
    res.status(200).json({ commits: all.toReversed(), latest, total });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("An unknown error occurred:", error);
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
}
