import express, { type Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

import { extractNextPageUrl, aggregateReactions } from "./utils";

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
    const { drugName, limit = "5", search_after } = req.query;

    if (!drugName) {
      return res.status(400).json({
        error: "Missing parameter",
        details: "drugName parameter is required",
      });
    }

    // Validate limit parameter
    const limitNum = Number(limit as string);
    if (isNaN(limitNum) || limitNum < 1) {
      return res.status(400).json({
        error: "Invalid limit parameter",
        details: "limit must be positive",
      });
    }

    let searchQuery = `patient.drug.openfda.brand_name:"${drugName}"`;

    // Build request parameters
    const params: Record<string, string> = {
      search: searchQuery,
      limit: `${limitNum}`,
      sort: "receivedate:asc",
    };

    if (search_after) {
      params.search_after = search_after as string;
    }

    const response = await axios.get<FDAResponse>(openFdaApiUrl, {
      params,
      headers: {
        Accept: "application/json",
      },
    });

    const { results, meta } = response.data;

    const aggregatedReactions = aggregateReactions(results);

    const nextPageUrl = extractNextPageUrl(response);

    const apiResponse: ApiResponse = {
      reactions: aggregatedReactions,
      meta: {
        disclaimer: meta.disclaimer,
        lastUpdated: meta.last_updated,
        total: meta.results.total,
      },
      nextPageUrl,
    };

    return res.status(200).json(apiResponse);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status || 500;
      const errorMessage =
        error.response?.data?.error?.message ||
        error.response?.data?.error ||
        "Error fetching drug reactions";

      if (statusCode === 429) {
        return res.status(429).json({
          error: "Rate limit exceeded",
          details: "Too many requests to the FDA API",
        });
      }

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
