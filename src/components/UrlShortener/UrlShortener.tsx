import React from "react";
import styles from "./UrlShortener.module.css";
import { Skeleton } from "@nextui-org/skeleton";
import { UrlShortType } from "@/utils/types";

type UrlShortenerProps = {
  urlShortenerResults?: UrlShortType;
};

const UrlShortener = ({ urlShortenerResults }: UrlShortenerProps) => {
  return (
    <>
      {urlShortenerResults ? (
        <div className={`${styles.urlShortenerContainer} bg-white p-6 rounded-lg shadow-lg`}>
          <div className={styles.urlRow}>
            <div>
              <div className="font-bold text-lg text-gray-800">
                Original URL:
              </div>
              <div className={`${styles.originalUrl} text-blue-600 break-all`}>
                {urlShortenerResults.Response}
              </div>
            </div>
            <div>
              <div className="font-bold text-lg text-gray-800 mt-4">
                Shortened URL:
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={`${styles.urlShortenerContainer} bg-white p-6 rounded-lg shadow-lg`}>
          <div className={styles.urlRow}>
            <div>
              <Skeleton className={`${styles.skeletonOriginalUrl} h-5 w-full mb-4`} />
              <Skeleton className={`${styles.skeletonShortenedUrl} h-5 w-full`} />
            </div>
            <div>
              <Skeleton className={`${styles.skeletonAlias} h-5 w-full mt-4`} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UrlShortener;
