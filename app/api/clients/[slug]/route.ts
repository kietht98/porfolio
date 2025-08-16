const NUMBER_DATA = 1000000;
export async function GET() {
  return Response.json({
    data: {
      totalCounts: NUMBER_DATA,
      clients: new Array(NUMBER_DATA).fill(null),
    },
  });
}
