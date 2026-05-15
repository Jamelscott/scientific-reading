import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

export const exportTableToPdf = async (
  className: string,
  teacherName: string = "Teacher",
): Promise<void> => {
  // Hide buttons temporarily
  const backButton = document.querySelector("button") as HTMLElement;
  const buttons = document.querySelectorAll(
    '[class*="bg-[#38b6ff]"], [class*="border-[#dff3ff]"]',
  ) as NodeListOf<HTMLElement>;

  const backup: { element: HTMLElement; display: string }[] = [];
  if (backButton) {
    backup.push({ element: backButton, display: backButton.style.display });
    backButton.style.display = "none";
  }
  buttons.forEach((btn) => {
    backup.push({ element: btn, display: btn.style.display });
    btn.style.display = "none";
  });

  try {
    // Get the main container and header
    const pageContainer = document.querySelector(
      ".h-screen",
    ) as HTMLElement;
    const scrollableContainer = document.querySelector(".flex-1") as HTMLElement;
    
    if (!pageContainer || !scrollableContainer) return;

    // Store original styles
    const originalOverflow = scrollableContainer.style.overflow;
    const originalHeight = scrollableContainer.style.height;
    const originalMaxHeight = scrollableContainer.style.maxHeight;

    // Temporarily remove scroll constraints to show all content
    scrollableContainer.style.overflow = "visible";
    scrollableContainer.style.height = "auto";
    scrollableContainer.style.maxHeight = "none";

    // Wait for layout to adjust
    await new Promise((resolve) => setTimeout(resolve, 100));

    const canvas = await html2canvas(pageContainer, {
      scale: 2,
      backgroundColor: "#ffffff",
      allowTaint: true,
      useCORS: true,
      logging: false,
      windowHeight: pageContainer.scrollHeight,
    });

    // Restore original styles
    scrollableContainer.style.overflow = originalOverflow;
    scrollableContainer.style.height = originalHeight;
    scrollableContainer.style.maxHeight = originalMaxHeight;

    const imgData = canvas.toDataURL("image/png");
    
    // Calculate dimensions to fit everything on one page
    const imgWidthMm = 297; // A4 landscape width
    const imgHeightMm = (canvas.height * imgWidthMm) / canvas.width;
    
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [imgWidthMm + 20, imgHeightMm + 20], // Custom size with margins
    });

    // Add the entire image on a single page
    pdf.addImage(imgData, "PNG", 10, 10, imgWidthMm, imgHeightMm);

    // Sanitize filename - remove special characters and replace spaces
    const sanitizedClassName = className
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "_")
      .substring(0, 30);
    
    const sanitizedTeacherName = teacherName
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "_")
      .substring(0, 20);

    pdf.save(`${sanitizedTeacherName}_${sanitizedClassName}-report.pdf`);
  } catch (error) {
    console.error("PDF export failed:", error);
  } finally {
    // Restore buttons
    backup.forEach(({ element, display }) => {
      element.style.display = display;
    });
  }
};
