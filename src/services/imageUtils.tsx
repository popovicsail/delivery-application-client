export function toImageUrl(base64: any, mimeType = "image/png") {
    if (!base64) return null;
  
    // Ako backend već vrati ceo data URI, samo ga prosledi
    if (base64.startsWith("data:")) {
      return base64;
    }
  
    return `data:${mimeType};base64,${base64}`;
  }