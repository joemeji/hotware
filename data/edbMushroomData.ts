import { base } from "@/lib/azureUrls";
import uniqid from "@/utils/text";
import React from "react";

export const steps = [
  "Box type (left) and Mushroom type (right) Electric Distribution Boards (EDB)",
  "Checking the frame for damaged parts",
  "Checking the brakes/stops of caster wheels",
  "Checking the power sockets for damage",
  "EDB Box and the components inside",
  "Trying to pull the wires gently to check if there are no loose connections",
  "Inspection stickers, warning stickers, and company sticker",
  "Testing RCD (circuit breaker) using the test button",
  "Measuring the tripping time of RCD in millisecond using Fluke 1653B multi-tester (snapshot from youtube video)",
];

export const stepContents = [
  {
    title:
      "Box type (left) and Mushroom type (right) Electric Distribution Boards (EDB)",
    description:
      "Checking of EDB when NOT connected to electrical power source: Important reminder: All found defects should be marked and reported immediately for appropriate action (repair or replacement).",
    images: [
      base + "/app/ventilator/edb-chinese/1-1.jpg",
      base + "/app/ventilator/edb-chinese/1-2.jpg",
    ],
    stepRef: React.createRef<HTMLDivElement>(),
    uid: uniqid(),
  },
  {
    title: "Checking the frame for damaged parts",
    description:
      "Visually check the frame for damaged parts, bends, and broken welding joints (Figure 2).",
    images: [base + "/app/ventilator/edb-chinese/2-1.jpg"],
    stepRef: React.createRef<HTMLDivElement>(),
    uid: uniqid(),
  },
  {
    title: "Checking the brakes/stops of caster wheels.",
    description:
      "Also check the 4 caster wheels of the frames for damaged parts, including the brakes or stopper (Figure 3). Try to push or pull the frame to see if it can move freely on the floor with its wheels. Apply the brakes to check if they can prevent the wheels from rolling to hold the EDB in position.",
    images: [base + "/app/ventilator/edb-chinese/3-1.jpg"],
    stepRef: React.createRef<HTMLDivElement>(),
    uid: uniqid(),
  },
  {
    title: "Checking the power sockets for damage.",
    description:
      "Visually check all the sockets (for 5-pin plugs) if there are burnt parts (the normal color changed to black). Open the socket cover to also check the inside parts of the socket (Figure 4).",
    images: [base + "/app/ventilator/edb-chinese/4-1.jpg"],
    stepRef: React.createRef<HTMLDivElement>(),
    uid: uniqid(),
  },
  {
    title: "EDB Box and the components inside.",
    description:
      "Check the panel board box for damage/dent, also open the front cover of the box using its key to check the components inside (Figure 5). Check if there are burnt components or with signs of defects. Visually check the wires, terminals, compression glands, circuit breakers (RCD) if there are discoloration (from normal color to black) as indication of a burnt part.",
    images: [base + "/app/ventilator/edb-chinese/5-1.jpg"],
    stepRef: React.createRef<HTMLDivElement>(),
    uid: uniqid(),
  },
  {
    title:
      "Trying to pull the wires gently to check if there are no loose connections.",
    description:
      "Check also if the wires are properly connected. Try to pull them gently just to check if there are no loose connections (Figure 6). Loose electrical connections can cause electric shocks and fires.",
    images: [base + "/app/ventilator/edb-chinese/6-1.jpg"],
    stepRef: React.createRef<HTMLDivElement>(),
    uid: uniqid(),
  },
  {
    title: "Inspection stickers, warning stickers, and company sticker.",
    description:
      "Also check if there are missing parts such as cable gland, circuit breaker lock, etc. Verify if the following has been placed or is in good and visible condition: maintenance card, inspection stickers, type plate with S/N and data, wiring diagram, attention electricity sticker, and HW sticker (Figure 7).",
    images: [base + "/app/ventilator/edb-chinese/7-1.jpg"],
    stepRef: React.createRef<HTMLDivElement>(),
    uid: uniqid(),
  },
  {
    title: "Testing RCD (circuit breaker) using the test button.",
    description:
      "Test the RCDs if they function properly. RCDs are protective devices used in electrical installations. They are designed to quickly break electrical circuits, and this prevents the user of the device from any serious harm. RCDs are easily testable (with test button, Figure 8) and re-settable devices (with reset button or lever). With the EDB connected to an electrical power source, test each RCD by pressing the test button if it can break the electrical circuit in less than a second (0,3 s). Not functioning RCDs should be replaced.",
    images: [base + "/app/ventilator/edb-chinese/8-1.jpg"],
    stepRef: React.createRef<HTMLDivElement>(),
    uid: uniqid(),
  },
  {
    title:
      "Measuring the tripping time of RCD in millisecond using Fluke 1653B multi-tester (snapshot from youtube video).",
    description:
      "Using a multifunction tester (such as Fluke 1653B electrical installation tester), check the protective resistance. It should be less than 0,30 . Also check the isolation resistance. It should be greater than 2 M. Record the readings in the inspection form.",
    images: [base + "/app/ventilator/edb-chinese/9-1.jpg"],
    stepRef: React.createRef<HTMLDivElement>(),
    uid: uniqid(),
  },
];
