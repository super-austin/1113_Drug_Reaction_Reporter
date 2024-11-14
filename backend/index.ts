import express, { type Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

import type { FDAResponse, ApiResponse } from "./common.types";

dotenv.config();

const app = express();

const port = process.env.PORT || 5000;
const openFdaApiUrl =
  process.env.OPEN_FDA_API_URL || "https://api.fda.gov/drug/event.json";

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.get("/api/drug-reactions", async (req: Request, res: Response) => {
  try {
    const { drugName } = req.query;

    const { data } = await axios.get<FDAResponse>(openFdaApiUrl, {
      params: {
        search: `patient.drug.openfda.brand_name:"${drugName}"`,
        count: "patient.reaction.reactionmeddrapt.exact",
      },
    });

    const allReactions = data.results;

    const apiResponse: ApiResponse = {
      reactions: allReactions,
      totalResults: allReactions.length,
    };

    return res.status(200).json(apiResponse);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status || 500;
      const errorMessage =
        error.response?.data?.error?.message ||
        error.response?.data?.error ||
        "Error fetching drug reactions";

      res.status(statusCode).json({
        error: errorMessage,
        details: error.message,
      });
    } else {
      res.status(500).json({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
});

app.listen(port, () => {
  console.info(`Server is running on PORT: ${port}`);
});
