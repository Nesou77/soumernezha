import OpengraphImage from "../opengraph-image";

// Same localized share image as the home page. Inner pages need their own file:
// their `openGraph` metadata would otherwise replace the inherited image.
export const alt = "Nezha Soumer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default OpengraphImage;
