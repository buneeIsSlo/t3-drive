// Helper function to convert size strings to bytes
function parseSize(sizeStr: string): number {
  const size = parseFloat(sizeStr);
  const unit = sizeStr.split(" ")[1]?.toUpperCase();

  switch (unit) {
    case "KB":
      return Math.round(size * 1024);
    case "MB":
      return Math.round(size * 1024 * 1024);
    case "GB":
      return Math.round(size * 1024 * 1024 * 1024);
    default:
      return Math.round(size);
  }
}

// Database-compatible folder data (root folder has id: 0)
const mockFolders = [
  {
    id: 0,
    name: "root",
    parent: null,
  },
  {
    id: 1,
    name: "Documents",
    parent: 0,
  },
  {
    id: 2,
    name: "Images",
    parent: 0,
  },
  {
    id: 3,
    name: "Projects",
    parent: 4,
  },
  {
    id: 4,
    name: "Work",
    parent: 0,
  },
];

// Database-compatible file data
const mockFiles = [
  {
    id: 1,
    name: "Fight.pdf",
    parent: 0,
    size: parseSize("414 KB"),
    url: "/files/Fight.pdf",
  },
  {
    id: 2,
    name: "Club.png",
    parent: 0,
    size: parseSize("414 KB"),
    url: "/files/Club.png",
  },
  {
    id: 3,
    name: "test.txt",
    parent: 0,
    size: parseSize("414 KB"),
    url: "/files/test.txt",
  },
  {
    id: 4,
    name: "Resume.pdf",
    parent: 1,
    size: parseSize("245 KB"),
    url: "/files/Resume.pdf",
  },
  {
    id: 5,
    name: "Cover Letter.docx",
    parent: 1,
    size: parseSize("89 KB"),
    url: "/files/Cover-Letter.docx",
  },
  {
    id: 6,
    name: "Project Proposal.pdf",
    parent: 1,
    size: parseSize("1.2 MB"),
    url: "/files/Project-Proposal.pdf",
  },
  {
    id: 7,
    name: "vacation-photo.jpg",
    parent: 2,
    size: parseSize("2.4 MB"),
    url: "/files/vacation-photo.jpg",
  },
  {
    id: 8,
    name: "screenshot.png",
    parent: 2,
    size: parseSize("856 KB"),
    url: "/files/screenshot.png",
  },
  {
    id: 9,
    name: "logo-design.svg",
    parent: 2,
    size: parseSize("124 KB"),
    url: "/files/logo-design.svg",
  },
  {
    id: 10,
    name: "Spreadsheet.xlsx",
    parent: 4,
    size: parseSize("567 KB"),
    url: "/files/Spreadsheet.xlsx",
  },
  {
    id: 11,
    name: "Presentation.pptx",
    parent: 4,
    size: parseSize("3.2 MB"),
    url: "/files/Presentation.pptx",
  },
  {
    id: 12,
    name: "Website Mockup.fig",
    parent: 3,
    size: parseSize("4.1 MB"),
    url: "/files/Website-Mockup.fig",
  },
  {
    id: 13,
    name: "Database Schema.sql",
    parent: 3,
    size: parseSize("45 KB"),
    url: "/files/Database-Schema.sql",
  },
];

export { mockFolders, mockFiles };
