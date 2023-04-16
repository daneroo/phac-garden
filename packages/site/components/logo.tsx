import { useState, useEffect } from "react";

// export const AnimArc = () => {
//   const [count, setCount] = useState(0);
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       // if (count > 100) return;
//       setCount(count + 1);
//     }, 200);
//     return () => clearTimeout(timer);
//   });
//   return (
//     <path
//       d={`M -1,0 A 1,${Math.sin(angle)} 1   0 ${sweep}   1 0`}
//       stroke="lime"
//     />
//   );
// };

// Traces a single arc (longitude line like)
// a is the angle in degrees, range: -90..0..90
function Arc({ a = 0, radius = 25, stroke = 'grey' }) {
  const sweep = a < 0 ? 0 : 1;
  // Convert to radians: 90° = 8π/16
  // const aRadians = (a / 90 * 8 * Math.PI) / 16;
  const aRadians = a * (Math.PI / 2) / 90;
  // I am using the ry:=sin(a) to get the right shape
  const ry = Math.sin(aRadians);
  // A rx ry x-axis-rotation large-arc-flag sweep-flag x y 
  const x = 1 * radius, y = 0 * radius
  return (
    <path
      d={`M ${-x},${y} A 1,${ry} 1   0 ${sweep}  ${x} ${y}`}
      stroke={stroke}
    />
  )
}

interface LogoVariantProps {
  variant?: "simple" | "dsco" | "earthy"; // 👈️ marked optional
}
export function LogoVariant({ variant = "simple" }: LogoVariantProps) {
  // To match our logo we use the same coordinate viewBox 0 0 64 64
  // But to make scaling and circle math sane we translate by 32,32 
  // to have the circles (and arcs) centered at 0,0
  // stroke is the stroke color of our circle/earth/DSCO ball
  const stroke = "grey"
  // radius is the size of our circle/earth/DSCO ball, +/-32 being edge of the viewBox after translation
  const radius = 25;
  const options = {
    simple: {
      longitudeAngles: [],
      tilt: 0,
      strokeWidth: 1,
    },
    dsco: {
      // These match the DSCO Stickers)
      longitudeAngles: [-56.25, -33.75, -13.5, 13.5, 33.75, 56.25],
      tilt: 0,
      strokeWidth: 1,
    },
    earthy: {
      // every 15 degrees
      longitudeAngles: [-75, -60, -45, -30, -15, 0, 15, 30, 45, 60, 75],
      tilt: 23.5,
      strokeWidth: .3,
    },
  };
  // longitudeAngles are the set of angles where our longitude arc-lines are drawn
  // tilt is the tilt of the globe in degrees
  // strokeWidth is the width of the drawn lines
  const { longitudeAngles, tilt, strokeWidth } = options[variant];
  const axisAngles = [0 + tilt, 90 + tilt];
  // stubNub is the little stub at the pole (but only for DSCO variant)
  const stubNub = variant == "dsco" ? (
    <g transform={`rotate(${axisAngles[0]})`} >
      <path d={`M 0,${-radius} L 0,${-radius * 1.1}`} stroke={stroke} />
    </g>
  ) : null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="300"
      height="300"
      viewBox="0 0 64 64"
    >
      <g strokeWidth={strokeWidth} fill="none" transform="translate(32,32)">
        <circle r={radius} stroke={stroke} />
        {stubNub}
        {axisAngles.map((axisAngle, t) => (
          <g key={t} transform={`rotate(${axisAngle})`} >
            {longitudeAngles.map((a, i) => (
              <Arc key={i} a={a} radius={radius} stroke={stroke} />
            ))}
          </g>
        ))}
      </g>
      {/* This is our Sprout! */}
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
}

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
