import { useRef, useState, useEffect } from "react";
import { radios } from "@/data/radios";
import Image from "next/image";
import { useCurrentRadio } from "@/data/zustand"; 
import Heart from "@/components/Heart";
// import HeartSolid from "@/components/HeartSolid";
import Previous from "@/components/Previous";
import Play from "@/components/Play";
import Stop from "@/components/Stop";
import Next from "@/components/Next";
import Sound from "@/components/Sound";
import Spinner from "@/components/Spinner";

export default function Index() {
  const currentRadio = useCurrentRadio();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);

  useEffect(() => {
    if (audioRef.current) {
      setIsPlaying(!audioRef.current.paused);
    }
  }, [currentRadio.current]);

  const handleNext = () => {
    setIsBuffering(true);
    const currentIndex = radios.findIndex((radio) => radio.id === currentRadio.current?.id);
    const nextIndex = (currentIndex + 1) % radios.length;
    currentRadio.setCurrent(radios[nextIndex]);
  };
  
  const handlePrev = () => {
    setIsBuffering(true);
    const currentIndex = radios.findIndex((radio) => radio.id === currentRadio.current?.id);
    const prevIndex = (currentIndex - 1 + radios.length) % radios.length;
    currentRadio.setCurrent(radios[prevIndex]);
  };
  

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      }
      else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <header className="bg-white shadow-gray-900 p-4">
        <div className="max-w-screen-xl w-full mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-[800] text-gray-900">BiTunes</h1>
          <input 
            type="text" 
            placeholder="Search radio stations..." 
            className="border border-gray-300 rounded-md px-4 py-2 w-1/3" 
          />
        </div>
      </header>

      <main className="flex-1 max-w-screen-xl w-full mx-auto py-4 px-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Radio Stations</h2>
        <div className="space-y-0 bg-white rounded-lg shadow-md mb-24">
          {radios.map((radio) => (
            <div
              key={radio.id}
              className="flex items-center hover:shadow-lg transition-shadow duration-300 p-4">
              <div className="w-16 h-16 relative flex-shrink-0">
                <Image
                  src={`/logo/${radio.id}.jpg`}
                  alt={radio.name}
                  fill
                  className="object-contain rounded-md"
                />
              </div>
              <div className="ml-2 flex-1">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{radio.name}</h3>
                <p className="text-sm text-gray-600">
                  {
                    radio.frequency ? `${radio.frequency} MHz` : "Online Radio"
                  }
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  className="flex items-center justify-center w-10 h-10 bg-red-500 rounded-full hover:bg-red-400 md:w-auto md:px-4"
                  onClick={() => currentRadio.setCurrent(radio)}>
                  <Heart className="text-white" />
                  <span className="hidden md:inline ml-2 text-sm font-medium text-white">Favorite</span>
                </button>
                <button
                  className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full hover:bg-blue-400 md:w-auto md:px-4"
                  onClick={() => {
                    currentRadio.setCurrent(radio);
                    audioRef.current?.play();
                    setIsBuffering(true);
                  }}>
                  <Sound className="text-white" />
                  <span className="hidden md:inline ml-2 text-sm font-medium text-white">Listen Now</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {
        currentRadio.current && (
          <div
            className="fixed bottom-0 left-0 right-0 bg-white p-4 flex items-center justify-between shadow-gray-900"
            style={{
              boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.1)",
            }}>
            <div className="flex items-center justify-between max-w-screen-xl w-full mx-auto px-4">
              <div className="flex items-center">
                <Image 
                  src={`/logo/${currentRadio.current.id}.jpg`} 
                  alt={currentRadio.current.name} 
                  width={60} 
                  height={60} 
                  className="object-cover rounded-md mr-4" 
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{currentRadio.current.name}</h3>
                  <p className="text-sm text-gray-600">
                    {
                      currentRadio.current.frequency ? `${currentRadio.current.frequency} MHz` : "Online Radio"
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-3">
                <button 
                  onClick={handlePrev} 
                  className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600">
                  <Previous />
                </button>

                <button 
                  onClick={togglePlayPause} 
                  className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 h-12 w-12 flex items-center justify-center">
                  {
                    isBuffering ? <Spinner className="animate-spin" /> : isPlaying ? <Stop /> : <Play />
                  }
                </button>

                <button 
                  onClick={handleNext} 
                  className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600">
                  <Next />
                </button>
              </div>
              <audio 
                ref={audioRef} 
                src={currentRadio.current.streamUrl} 
                autoPlay
                hidden
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onPlaying={() => setIsBuffering(false)} 
                onWaiting={() => setIsBuffering(true)}
              />
            </div>
          </div>
        )
      }
    </div>
  );
}
