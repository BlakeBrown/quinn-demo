const getInitials = (name) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const generateLogoSvg = (companyName) => {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEEAD",
    "#D4A5A5",
    "#9B59B6",
    "#3498DB",
    "#E67E22",
    "#1ABC9C",
  ];

  const hash = companyName.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  const colorIndex = Math.abs(hash) % colors.length;
  const color = colors[colorIndex];

  const initials = getInitials(companyName);

  return `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" rx="10" fill="${color}"/>
        <text x="50" y="50" dy="0.35em" 
          fill="white" 
          font-family="Arial" 
          font-size="40" 
          text-anchor="middle"
          font-weight="bold">
          ${initials}
        </text>
      </svg>
    `)}`;
};

export const mockData = [
  {
    company: "Saint Xavier High School",
    logo: generateLogoSvg("Saint Xavier High School"),
    name: "Saint Xavier High School",
    domain: "saintx.com",
    categories: ["B2C", "Education"],
  },
  {
    company: "AC&M Group",
    logo: generateLogoSvg("AC&M Group"),
    name: "AC&M Group",
    domain: "acmconnect.com",
    categories: ["B2B", "Consulting & Professional", "Marketing & Advertising"],
  },
  {
    company: "SLOCOACH",
    logo: generateLogoSvg("SLOCOACH"),
    name: "SLOCOACH",
    domain: "slocoach.com",
    categories: ["B2C", "Education", "Sporting Goods"],
  },
  {
    company: "Calendly",
    logo: generateLogoSvg("Calendly"),
    name: "Calendly",
    domain: "satary.co",
    categories: ["B2B", "B2C", "Broadcasting", "Internet", "Publishing"],
  },
  {
    company: "Misfits Health",
    logo: generateLogoSvg("Misfits Health"),
    name: "Misfits Health",
    domain: "misfits.health",
    categories: ["B2C", "E-commerce", "Food", "Health & Wellness"],
  },
  {
    company: "Roughshot",
    logo: generateLogoSvg("Roughshot"),
    name: "Roughshot",
    domain: "roughshotsupply.co",
    categories: ["B2C", "Consumer Discretionary", "E-commerce"],
  },
  {
    company: "Calaxy",
    logo: generateLogoSvg("Calaxy"),
    name: "Calaxy",
    domain: "calaxy.com",
    categories: ["B2B", "B2C", "E-commerce", "Internet", "Marketplace"],
  },
  {
    company: "Influence Marketing",
    logo: generateLogoSvg("Influence Marketing"),
    name: "Influence Marketing",
    domain: "influencemarketing.ca",
    categories: [
      "B2B",
      "Marketing & Advertising",
      "Marketplace",
      "Media",
      "SAAS",
    ],
  },
  {
    company: "BRAYA",
    logo: generateLogoSvg("BRAYA"),
    name: "BRAYA",
    domain: "brayaus.com",
    categories: ["B2B", "B2C", "Events", "Marketing", "Public Relations"],
  },
  {
    company: "Advocate Aurora Health",
    logo: generateLogoSvg("Advocate Aurora Health"),
    name: "Advocate Aurora Health",
    domain: "aah.org",
    categories: [
      "B2C",
      "Health & Wellness",
      "Health Care",
      "Non-Profit & Philanthropy",
    ],
  },
  {
    company: "Samsung Next",
    logo: generateLogoSvg("Samsung Next"),
    name: "Samsung Next",
    domain: "samsungnext.com",
    categories: ["B2B", "Enterprise", "Venture Capital"],
  },
  {
    company: "CSE",
    logo: generateLogoSvg("CSE"),
    name: "CSE",
    domain: "csetalentrep.com",
    categories: ["B2B", "B2C", "Consulting", "Entertainment", "Marketing"],
  },
  {
    company: "Battlefy",
    logo: generateLogoSvg("Battlefy"),
    name: "Battlefy",
    domain: "battlefy.com",
    categories: ["B2B", "B2C", "E-commerce", "Information", "Mobile"],
  },
  {
    company: "Kinetic Society",
    logo: generateLogoSvg("Kinetic Society"),
    name: "Kinetic Society",
    domain: "kineticsociety.com",
    categories: ["Apparel & Footwear", "B2C", "Consumer Staples", "E-commerce"],
  },
  {
    company: "TXC Advisors",
    logo: generateLogoSvg("TXC Advisors"),
    name: "TXC Advisors",
    domain: "txcadvisors.com",
    categories: ["B2B", "Consulting & Professional", "Financial Services"],
  },
  {
    company: "ShineWater",
    logo: generateLogoSvg("ShineWater"),
    name: "ShineWater",
    domain: "shinewater.com",
    categories: ["B2C", "Beverages", "E-commerce", "Food"],
  },
  {
    company: "Goldon Studios",
    logo: generateLogoSvg("Goldon Studios"),
    name: "Goldon Studios",
    domain: "goldonstudios.com",
    categories: ["Video Games", "Entertainment", "Digital Media"],
  },
  {
    company: "TechFlow Solutions",
    logo: generateLogoSvg("TechFlow Solutions"),
    name: "TechFlow Solutions",
    domain: "techflow.io",
    categories: ["B2B", "SAAS", "Technology", "Enterprise"],
  },
  {
    company: "Green Earth Organics",
    logo: generateLogoSvg("Green Earth Organics"),
    name: "Green Earth Organics",
    domain: "greenearthorganics.com",
    categories: ["B2C", "Food & Beverage", "Sustainability"],
  },
  {
    company: "Nova Analytics",
    logo: generateLogoSvg("Nova Analytics"),
    name: "Nova Analytics",
    domain: "novaanalytics.ai",
    categories: ["B2B", "Data Analytics", "Enterprise", "SAAS"],
  },
  {
    company: "Peak Performance",
    logo: generateLogoSvg("Peak Performance"),
    name: "Peak Performance",
    domain: "peakperform.com",
    categories: ["B2C", "Fitness", "Health & Wellness", "Sporting Goods"],
  },
  {
    company: "Digital Frontier",
    logo: generateLogoSvg("Digital Frontier"),
    name: "Digital Frontier",
    domain: "digitalfrontier.tech",
    categories: ["B2B", "Digital Transformation", "Technology", "Consulting"],
  },
  {
    company: "Urban Eats",
    logo: generateLogoSvg("Urban Eats"),
    name: "Urban Eats",
    domain: "urbaneats.co",
    categories: ["B2C", "Food Delivery", "Marketplace", "Technology"],
  },
  {
    company: "CloudScale",
    logo: generateLogoSvg("CloudScale"),
    name: "CloudScale",
    domain: "cloudscale.net",
    categories: ["B2B", "Cloud Computing", "Enterprise", "SAAS"],
  },
  {
    company: "EcoStyle",
    logo: generateLogoSvg("EcoStyle"),
    name: "EcoStyle",
    domain: "ecostyle.com",
    categories: ["B2C", "Fashion", "Sustainability", "E-commerce"],
  },
];
