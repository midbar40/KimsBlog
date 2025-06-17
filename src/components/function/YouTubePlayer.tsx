import { useState } from "react";

const YouTubePlayer = () => {
  const [isVisible, setIsVisible] = useState(false); // UI 표시 여부
  const videoId = "IXzTJfLaq4U"; // 원하는 YouTube 영상 ID

  const handleToggle = () => {
    setIsVisible((prev) => !prev);
  };

  return (
    <div>
      <span
        onClick={handleToggle}
        className="text-indigo-300 cursor-pointer"
      >
        {isVisible ? "MusicHide" : "MusicShow"}
      </span>

      <div className={`fixed z-999 ${isVisible ? "block" : "hidden"}`}>
        <iframe
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default YouTubePlayer;