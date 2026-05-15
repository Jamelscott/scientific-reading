import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

export const exportStudentPageToPdf = async (
  studentName: string,
  studentId: string,
): Promise<void> => {
  const input = document.getElementById("student-page-main-content");

  if (!input) {
    console.error("Student page main content element not found!");
    return;
  }

  // Temporarily hide buttons for a clean PDF export
  const buttons = input.querySelectorAll("button");
  const originalButtonDisplays: string[] = [];
  buttons.forEach((button) => {
    originalButtonDisplays.push(button.style.display);
    button.style.display = "none";
  });

  const header = document.querySelector("#student-page-header") as HTMLElement | null;
  const originalHeaderDisplay = header?.style.display;
  if (header) {
    header.style.display = "none";
  }

  try {
    const canvas = await html2canvas(input, {
      scale: 2, // Increase scale for better quality
      useCORS: true, // Enable CORS if images are loaded from external sources
      backgroundColor: "#ffffff", // Set background color explicitly
      width: input.scrollWidth, // Capture full scrollable width
      height: input.scrollHeight, // Capture full scrollable height
      windowWidth: input.scrollWidth, // Set window width to capture full content
      windowHeight: input.scrollHeight, // Set window height to capture full content
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`rapport-${studentName}-${studentId}.pdf`);
  } catch (error) {
    console.error("Error exporting student page to PDF:", error);
  } finally {
    // Restore original button displays
    buttons.forEach((button, index) => {
      button.style.display = originalButtonDisplays[index];
    });
    // Restore original header display
    if (header && originalHeaderDisplay !== undefined) {
      header.style.display = originalHeaderDisplay;
    }
  }
};
