import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

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

export default function Header() {
  return (
    <header className="flex justify-between items-center w-full mt-5 border-b-2 pb-5 sm:px-8 px-2">
      <Link href="/" className="flex space-x-3">
        <Image
          alt="header text"
          src="/assistant.png"
          className="sm:w-10 sm:h-10 w-7 h-7"
          width={32}
          height={32}
          style={{ objectFit: "scale-down" }}
        />
        <motion.h1
          className="sm:text-3xl text-2xl font-bold ml-2 tracking-tight"
          style={gradient}
          animate={slide}
        >
          Language Assistant
        </motion.h1>
      </Link>
    </header>
  );
}
