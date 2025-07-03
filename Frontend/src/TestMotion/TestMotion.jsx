import React from 'react';
import * as motion from "motion/react-client";
import { Button } from '@mui/material';

const box = {
    width: 100,
    height: 100,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    position: "fixed", // or 'absolute' (fixed stays centered even when scrolling)
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)", // moves the box back by half its size
}
function TestMotion() {
  return (
    <motion.div
    animate={{
        scale: [1, -2, 0, 1, 1,-1],
        rotate: [0, -60, 180, -180, 0],
        borderRadius: ["0%", "0%", "50%", "50%", "0%"],
    }}
    transition={{
        duration: 2,
        ease: "easeInOut",
        times: [0, 0.8, 0.5, 0.8, 1],
        repeat: Infinity,
        repeatDelay: 1,
    }}
    style={box}
/>
  )
}

export default TestMotion