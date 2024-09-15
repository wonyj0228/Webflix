import { useEffect, useState } from "react";

export const makeImgUrl = (path: string, format?: string) => {
  return `https://image.tmdb.org/t/p/${format ? format : "original"}/${path}`;
};

function getWindowDimensions() {
  const width = window.innerWidth;
  return width;
}

export const useWindowDimensions = () => {
  const [windowWidth, setWindowWidth] = useState(getWindowDimensions());

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWindowWidth(getWindowDimensions());
    });
  }, []);

  return windowWidth;
};
