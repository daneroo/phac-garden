import { useState, useEffect } from "react";

export const Arc = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      // if (count > 100) return;
      setCount(count + 1);
    }, 200);
    return () => clearTimeout(timer);
  });
  const angle = (count * Math.PI) / 100;
  const sweep = 1;
  console.log(JSON.stringify({ angle, sweep }));
  return (
    <path
      d={`M -1,0 A 1,${Math.sin(angle)} 1   0 ${sweep}   1 0`}
      stroke="lime"
    />
  );
};

function AArc({ a = 0, sweep = 1 }) {
  // A rx ry x-axis-rotation large-arc-flag sweep-flag x y 

  // from - 8..0
  if (a < 0) {

  }
  // a from 0..8
  return (
    <path
      d={`M -1,0 A 1,${Math.sin((a * Math.PI) / 16)} 1   0 ${sweep}  1 0`}
      stroke="red"
    />
  )
}

const odds = [1, 3, 5, 7];
const evens = [2, 4, 6,];
const both = [0, 1, 2, 3, 4, 5, 6, 7];
const like = [1.2, 3, 5];
// const like = [1];
export const GlobeV = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="300"
    height="300"
    viewBox="0 0 64 64"
  >
    <g strokeWidth="0.03" fill="none" transform="translate(32,32)scale(25,25)">
      <circle r="1" stroke="grey" />
      {[23, 113].map((tilt, t) => (
        <g key={t} transform={`rotate(${tilt})`} >
          {like.map((a, i) => (
            <AArc key={100 + i} a={a} sweep={1} />
            // <path
            //   key={100 + i}
            //   d={`M -1,0 A 1,${Math.sin((a * Math.PI) / 16)} 1   0 1   1 0`}
            //   stroke="red"
            // />
          ))}
          {/*  A rx ry x-axis-rotation large-arc-flag sweep-flag x y */}
          {like.map((a, i) => (
            <AArc key={200 + i} a={a} sweep={0} />
          ))}
        </g>
      ))}
    </g>
    <g fill="#83bf4f">
      <path d="M48.5,38.4c-8,0-10.1-6.6-10.1-6.6s2.1-8.3,10.1-8.3C54,23.5,63,31,63,31S54,38.4,48.5,38.4z" />
      <path d="M18,6.7c6.3,6.4,2.6,13.6,2.6,13.6s-7.7,4.4-14-2C2.3,13.9,1,1,1,1S13.7,2.3,18,6.7z" />
    </g>
    <g fill="#75a843">
      <path d="m63 31c-5-1-10.1-1.6-15.1-1-4.9.5-9.9 2.3-13.2 5.7-1.7 1.7-2.9 3.7-3.5 5.9-.1.5-.2 1.1-.3 1.6-.1.6 0 1 0 1.7l.2 3.8.7 15.3h-5l.8-15.3.2-3.8c0-.6.1-1.4.2-2.1.1-.7.3-1.4.5-2.1.9-2.7 2.6-5 4.7-6.7 2.1-1.8 4.5-3 7-3.9 2.5-.8 5.1-1.2 7.7-1.3 5.1-.2 10.2.8 15.1 2.2" />
      <path d="m1 1c5.2 3.2 10 7.2 14.2 11.7 4.2 4.5 8 9.4 11.1 14.8 1.5 2.7 3 5.5 3.9 8.7.2.8.4 1.6.5 2.5l.1 2.4.2 4.6.8 18.3h-5l.8-18.4.2-4.6.1-1.1c0-.4 0-.8 0-1.1 0-.6-.1-1.3-.3-2-.6-2.8-1.8-5.6-3.2-8.3-2.7-5.4-6.2-10.4-10.1-15.1-3.8-4.7-8.2-8.9-13.3-12.4" />
    </g>
  </svg >
)

// Just our regular CSV file as a component
export function Logo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="25" stroke="grey" strokeWidth="1" fill="none" />
      <g fill="#83bf4f">
        <path d="M48.5,38.4c-8,0-10.1-6.6-10.1-6.6s2.1-8.3,10.1-8.3C54,23.5,63,31,63,31S54,38.4,48.5,38.4z" />
        <path d="M18,6.7c6.3,6.4,2.6,13.6,2.6,13.6s-7.7,4.4-14-2C2.3,13.9,1,1,1,1S13.7,2.3,18,6.7z" />
      </g>
      <g fill="#75a843">
        <path d="m63 31c-5-1-10.1-1.6-15.1-1-4.9.5-9.9 2.3-13.2 5.7-1.7 1.7-2.9 3.7-3.5 5.9-.1.5-.2 1.1-.3 1.6-.1.6 0 1 0 1.7l.2 3.8.7 15.3h-5l.8-15.3.2-3.8c0-.6.1-1.4.2-2.1.1-.7.3-1.4.5-2.1.9-2.7 2.6-5 4.7-6.7 2.1-1.8 4.5-3 7-3.9 2.5-.8 5.1-1.2 7.7-1.3 5.1-.2 10.2.8 15.1 2.2" />
        <path d="m1 1c5.2 3.2 10 7.2 14.2 11.7 4.2 4.5 8 9.4 11.1 14.8 1.5 2.7 3 5.5 3.9 8.7.2.8.4 1.6.5 2.5l.1 2.4.2 4.6.8 18.3h-5l.8-18.4.2-4.6.1-1.1c0-.4 0-.8 0-1.1 0-.6-.1-1.3-.3-2-.6-2.8-1.8-5.6-3.2-8.3-2.7-5.4-6.2-10.4-10.1-15.1-3.8-4.7-8.2-8.9-13.3-12.4" />
      </g>
    </svg>
  )
}
