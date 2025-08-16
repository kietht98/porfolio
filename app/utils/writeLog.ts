import { NextRequest, NextResponse } from "next/server";

/**
 * Logs API request and response details.
 * @param {NextApiRequest} req - The API request object.
 * @param {NextApiResponse} res - The API response object.
 * @param {string} message - Custom message to log.
 */
export function writeLog(req: NextRequest, res: NextResponse, message = "") {
  console.log(`
    [API LOG]: ${new Date().toISOString()}
    Method: ${req.method}
    URL: ${req.url}
    Status: ${res.status}
    Message: ${message}
    Body: ${JSON.stringify(req.body)}
    `);
}
