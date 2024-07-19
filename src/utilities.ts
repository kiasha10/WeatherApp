export function formatDateWithDay(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

export async function getAreaNameFromCoordinates(
  lat: number,
  lon: number
): Promise<string> {
  const apiKey = "266be0db9ce54ced9b8c41544b448c7c";
  const response = await fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}`);
  const data = await response.json();

  if (data.results.length > 0) {
    return data.results[0].formatted;
  }
  return "An error occured";
}
