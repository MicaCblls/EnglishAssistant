import { AnimatePresence, motion } from "framer-motion";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import DropDown, { LanguageType } from "../components/DropDown";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import ResizablePanel from "../components/ResizablePanel";

const gradient = {
  background: "linear-gradient(180deg, #22d3ee,#155e75)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

const slide = {
  backgroundPosition: "0% 0%",
  transition: {
    repeat: Infinity,
    duration: 2,
    ease: "easeInOut",
  },
  backgroundPosition2: "100% 100%",
};

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState("");
  const [language, setLanguages] = useState<LanguageType>("Spanish");
  const [resLanguage, setResLanguages] = useState<LanguageType>("English");
  const [generatedResponse, setGeneratedResponse] = useState("");

  const prompt = `Hi ChatGPT, I need your help with a translation and explanation about a specific topic from the language ${language}. The topic is ${request}, and I need a thorough explanation in ${resLanguage}.`;

  const showToast = () => {
    toast("Please enter the topic you need help with.", {
      position: "top-center",
    });
  };

  const generateBio = async (e: any) => {
    e.preventDefault();
    setGeneratedResponse("");
    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });
    console.log("Edge function returned.");

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedResponse((prev) => prev + chunkValue);
    }

    setLoading(false);
  };

  return (
    <div className="flex bg-cyan mx-auto flex-col items-center justify-center py-2 min-h-screen w-full">
      <Head>
        <title>Language Assistant</title>
        <link rel="icon" href="../translateIcon.ico" />
      </Head>

      <Header />
      <main className="flex flex-1 max-w-5xl flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <motion.h1
          className="sm:text-6xl text-4xl max-w-2xl font-bold text-slate-900 h-20"
          style={gradient}
          animate={slide}
        >
          Hi! How can I help you?
        </motion.h1>
        <div className="max-w-xl w-full">
          <div className="flex mt-10 items-center space-x-3">
            <Image
              src="/1-black.png"
              width={30}
              height={30}
              alt="1 icon"
              className="mb-5 sm:mb-0"
            />
            <p className="text-left font-medium text-lg">
              Enter the topic on which you need advice
            </p>
          </div>
          <textarea
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            placeholder={"e.g. French cuisine"}
          />
          <div className="flex mb-5 items-center space-x-3 ">
            <Image src="/2-black.png" width={30} height={30} alt="1 icon" />
            <p className="text-left font-medium text-lg">
              Select the language you need help with
            </p>
          </div>
          <div className="block my-5">
            <DropDown
              vibe={language}
              setVibe={(newVibe) => setLanguages(newVibe)}
            />
          </div>
          <div className="flex mb-5 items-center space-x-3">
            <Image src="/2-black.png" width={30} height={30} alt="1 icon" />
            <p className="text-left font-medium text-lg">
              Select in which language you want to receive the answer
            </p>
          </div>
          <div className="block">
            <DropDown
              vibe={resLanguage}
              setVibe={(newVibe) => setResLanguages(newVibe)}
            />
          </div>

          {!loading && (
            <button
              className="bg-darkCyan rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-darkCyan/80 w-full"
              onClick={(e) => (request.length ? generateBio(e) : showToast())}
            >
              Generate response &rarr;
            </button>
          )}
          {loading && (
            <button
              className="bg-darkCyan rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-darkCyan/80 w-full"
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>
          )}
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <ResizablePanel>
          <AnimatePresence mode="wait">
            <motion.div className="space-y-10 my-10">
              {generatedResponse && (
                <>
                  <div>
                    <h2 className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto">
                      Your generated response
                    </h2>
                  </div>
                  <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                    <div
                      className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedResponse);
                        toast("Response copied to clipboard", {
                          icon: "✂️",
                        });
                      }}
                    >
                      <p>{generatedResponse}</p>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
