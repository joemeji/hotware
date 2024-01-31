import { base } from "@/lib/azureUrls";
import uniqid from "@/utils/text";
import React from "react";

export const steps = [
  "Before connecting electrical plug",
  "Special attention to electrical box, wheels, brakes, and air out flange",
  "Electrical connection",
  "ON-OFF button and optical beacon and beeper",
  "Tight all power terminals and Pull the wires to confirm the connection",
  "The power cables, which come from the input cable, plug, must be connected",
  "Our extensions have 5-pin plugs and sockets (CEE type) and must have all 5 cables connected, including the NEUTRAL",
  "Connect the ventilator plug on the EDB",
  "Steps 9",
  "Step 10",
];

export const step1To7Contents = [
  {
    title: "Before connecting electrical plug",
    description:
      "Visually check the outside of the fan, looking for any defect that could prevent the engine from turning, dents or any impact in the turbine area, any screw untight.",
    images: [
      base + "/app/ventilator/combustion/Optimized-1-original1.jpg",
      base + "/app/ventilator/combustion/Optimized-1-original2.jpg",
      base + "/app/ventilator/combustion/Optimized-1-original3.jpg",
    ],
    stepRef: React.createRef<HTMLDivElement>(),
    uid: uniqid(),
  },
  {
    title:
      "Special attention to electrical box, wheels, brakes and air out flange",
    description: "",
    images: [
      base + "/app/ventilator/combustion/Optimized-2-original1.jpg",
      base + "/app/ventilator/combustion/Optimized-2-original2.jpg",
    ],
    stepRef: React.createRef<HTMLDivElement>(),
    uid: uniqid(),
  },
  {
    title: "Electrical connections",
    description: "",
    images: [
      base + "/app/ventilator/combustion/Optimized-3-original1.jpg",
      base + "/app/ventilator/combustion/Optimized-3-original2.jpg",
    ],
    stepRef: React.createRef<HTMLDivElement>(),
    uid: uniqid(),
  },
  {
    title: "ON-OFF button and optical beacon and beeper",
    description:
      "Open the electrical panel and check for loose cables or anything that looks abnormal. All cables must be connected or insulated.",
    images: [
      base + "/app/ventilator/combustion/Optimized-4-original1.jpg",
      base + "/app/ventilator/combustion/Optimized-4-original2.jpg",
    ],
    stepRef: React.createRef<HTMLDivElement>(),
    uid: uniqid(),
  },
  {
    title:
      "Tight all power terminals and Pull the wires to confirm the connection",
    description:
      "Any cable out of place is potentially dangerous for the operator and equipment.",
    images: [
      base + "/app/ventilator/combustion/Optimized-5-original1.jpg",
      base + "/app/ventilator/combustion/Optimized-5-original2.jpg",
      base + "/app/ventilator/combustion/Optimized-5-original3.jpg",
    ],
    stepRef: React.createRef<HTMLDivElement>(),
    uid: uniqid(),
  },
  {
    uid: uniqid(),
    title:
      "The power cables, which come from the input cable, plug, must be connected as follows:",
    listDescription: [
      "L1 – Brown",
      "L2 – Black",
      "L3 – Grey",
      "Earth- Yellow/Green",
    ],
    description:
      "(Neutral is not connected on this board, check if it has a terminal at the tip or is well insulated so that electrical contact is not possible.)",
    images: [base + "/app/ventilator/combustion/Optimized-6-original1.jpg"],
    stepRef: React.createRef<HTMLDivElement>(),
  },
  {
    uid: uniqid(),
    title:
      "Our extensions have 5-pin plugs and sockets (CEE type) and must have all 5 cables connected, including the NEUTRAL",
    listDescription: [
      "L1 – Brown",
      "L2 – Black",
      "L3 – Grey",
      "Earth- Yellow/Green",
      "Neutral - Blue",
    ],
    description: "",
    images: [base + "/app/ventilator/combustion/Optimized-7-original1.jpg"],
    stepRef: React.createRef<HTMLDivElement>(),
  },
];

export const step8To10Contents = [
  {
    uid: uniqid(),
    title: "Connect the ventilator plug on the EDB",
    contents: [
      {
        description: "( 3 options, 16Amp, 32Amp or 63 Amperes)",
        images: [base + "/app/ventilator/combustion/Optimized-8-original1.jpg"],
      },
      {
        description:
          "Switches the main button to 1 and check L1, L2 and L3 lights. And two red lights STOP, all must be ON",
        images: [
          base + "/app/ventilator/combustion/Optimized-8-original2.jpg",
          base + "/app/ventilator/combustion/Optimized-8-original3.jpg",
        ],
      },
      {
        description:
          "Switches the main button to 1 and check L1, L2 and L3 lights. And two red lights STOP, all must be ON and It must be counterclockwise.",
        images: [
          base + "/app/ventilator/combustion/Optimized-8-original4.jpg",
          base + "/app/ventilator/combustion/Optimized-8-original5.jpg",
        ],
      },
      {
        description:
          "If the fan is running backwards ( clockwise ) Keep the red lights on, disconnect the plug from the respective fan, check that the lights are off",
        images: [
          base + "/app/ventilator/combustion/Optimized-8-original6.jpg",
          base + "/app/ventilator/combustion/Optimized-8-original7.jpg",
        ],
      },
      {
        description:
          "Attention: when multiple fans are connected to the same EDB it can be confusing to disconnect the correct fan. Invert the position of the cables between terminals L2 and L3 making:",
        listDescription: [
          "L1 – Brown",
          "L2 – Grey",
          "L3 – Black",
          "Earth- Yellow/Green",
        ],
        additionalDescription:
          "After well tight, we can connect the plug again in the same place of the EDB",
        images: [base + "/app/ventilator/combustion/Optimized-8-original8.jpg"],
      },
      {
        description:
          "Now we can confirm the rotation push the Button START BLOWER (1), after one second push the Button STOP BLOWER (2)",
        images: [base + "/app/ventilator/combustion/Optimized-8-original3.jpg"],
      },
      {
        description:
          "In the center of fan we can check the direction of rotation",
        images: [base + "/app/ventilator/combustion/Optimized-8-original4.jpg"],
      },
    ],
    stepRef: React.createRef<HTMLDivElement>(),
  },
  {
    uid: uniqid(),
    contents: [
      {
        description:
          "Connect the solenoid valves on the cabinet, BCU Burner control, 3 pin Amphenol",
        images: [base + "/app/ventilator/combustion/Optimized-8-original1.jpg"],
      },
      {
        description:
          "Connect the cable referring to the BURNER connector, 5 pin Amphenol \n\n Note: Check again if there are no possibility to have gas on the burners, if it is already connected the pipes verify if all manual valves are closed.",
        images: [
          base + "/app/ventilator/combustion/Optimized-8-original2.jpg",
          base + "/app/ventilator/combustion/Optimized-8-original3.jpg",
        ],
      },
      {
        description:
          "Switches the main button to 1 and check L1, L2 and L3 lights. And two red lights STOP, all must be ON and It must be counterclockwise.",
        images: [
          base + "/app/ventilator/combustion/Optimized-9-original3.jpg",
          base + "/app/ventilator/combustion/Optimized-9-original4.jpg",
          base + "/app/ventilator/combustion/Optimized-9-original5.jpg",
          base + "/app/ventilator/combustion/Optimized-9-original6.jpg",
          base + "/app/ventilator/combustion/Optimized-9-original1.jpg",
        ],
      },
    ],
    stepRef: React.createRef<HTMLDivElement>(),
  },
  {
    uid: uniqid(),
    contents: [
      {
        description:
          "First test – Identify the spark plug, and the spark plug pipe, confirm that it´s connected",
        images: [
          base + "/app/ventilator/combustion/Optimized-10-original1.jpg",
          base + "/app/ventilator/combustion/Optimized-10-original2.jpg",
          base + "/app/ventilator/combustion/Optimized-10-original3.jpg",
        ],
      },
      {
        description:
          "Confirm that the button on the burner is ON, this button cut the fireye, ultraviolet scanner through the pressure switches on the air pipe.",
        images: [
          base + "/app/ventilator/combustion/Optimized-10-original4.jpg",
        ],
      },
      {
        description:
          "On the gas station of the burner, the button of MAIN / PILOT it’s used to cut line to MAIN valve, like this we can start only with a pilot (small amount of gas). For testing this button must be on MAIN ( to see all valves working). The pressure switch button can block the pressure switch when we don’t have enough gas on the inlet gas like when we are testing.",
        images: [
          base + "/app/ventilator/combustion/Optimized-10-original5.jpg",
        ],
      },
      {
        description:
          "Put the burner and the gas station on position that you can see when press the button. Spark, press START Blower, green light must keep ON and the ventilator running, Press START Burner during 4 seconds, on this time the green light on external beacon will be ON and at the same time 3 blue lights on the gas station too, the spark plug also sparks.",
        images: [
          base + "/app/ventilator/combustion/Optimized-10-original6.jpg",
          base + "/app/ventilator/combustion/Optimized-10-original7.jpg",
          base + "/app/ventilator/combustion/Optimized-10-original8.jpg",
        ],
      },
      {
        description:
          "Now we can test the UV scanner, at the rear we remove the scanner and put on the accessible position like on the photo, without flame the UV signal is YELLOW. We can simulate the burner fire with a lighter, the UV signal pass to GREEN",
        images: [
          base + "/app/ventilator/combustion/Optimized-10-original8.jpg",
          base + "/app/ventilator/combustion/Optimized-10-original10.jpg",
          base + "/app/ventilator/combustion/Optimized-10-original11.jpg",
        ],
      },
      {
        description: "After this, we can test the complete sequence:",
        listDescription: [
          "START Burner button (Green light on this button and beacon, blue lights on gas station)",
          "Light and keep the lighter in front of UV scanner (green light on UV Signal)",
          "Remove the finger from the Start button, the GREEN light on beacon and blue lights on gas station must continue lighting till the lighter is ON.",
          "urn OFF the lighter, immediately the blue lights on gas station, the green on beacon and on Start button goes OFF. the UV Signal return to YELLOW, on beacon flash a red light and a beep. Like this the system work well, to switch OFF the alarm and rearm the system press STOP Burner",
        ],
        images: [
          base + "/app/ventilator/combustion/Optimized-10-original12.jpg",
          base + "/app/ventilator/combustion/Optimized-10-original13.jpg",
          base + "/app/ventilator/combustion/Optimized-10-original14.jpg",
        ],
      },
    ],
    stepRef: React.createRef<HTMLDivElement>(),
  },
];
