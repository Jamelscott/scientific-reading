import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const exportContinuumToPdf = async (
  fileName: string = "continuum.pdf"
): Promise<void> => {
  // Find the 10-unit scrollable track element
  const track = document.querySelector(
    ".overflow-x-auto.pb-3.-mx-2.px-2.mt-6"
  ) as HTMLElement;
  // The actual content inside the scrollable track
  const content = track?.querySelector(".flex.gap-3") as HTMLElement | null;

  if (!track || !content) {
    console.error("Continuum track or content element not found");
    return;
  }

  // Hide all buttons inside the track (if any)
  const buttons = content.querySelectorAll("button") as NodeListOf<HTMLElement>;
  const backup: { element: HTMLElement; display: string }[] = [];
  buttons.forEach((btn) => {
    backup.push({ element: btn, display: btn.style.display });
    btn.style.display = "none";
  });

  try {
    // Wait for layout to adjust
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Render the full content (not just the visible area) to canvas
    const canvas = await html2canvas(content, {
      scale: 2,
      backgroundColor: "#ffffff",
      allowTaint: true,
      useCORS: true,
      logging: false,
      width: content.scrollWidth,
      height: content.offsetHeight,
      windowWidth: content.scrollWidth,
      windowHeight: content.offsetHeight,
    });

    const imgData = canvas.toDataURL("image/png");

    // PDF width in mm (A4 landscape is 297mm, but we want to fit the content)
    const pxToMm = (px: number) => (px * 210) / 794; // 794px is A4 width at 96dpi
    const imgWidthMm = pxToMm(canvas.width);
    const imgHeightMm = pxToMm(canvas.height);

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [imgWidthMm + 20, imgHeightMm + 20], // Add margins
    });

    pdf.addImage(imgData, "PNG", 10, 10, imgWidthMm, imgHeightMm);
    pdf.save(fileName);
  } catch (error) {
    console.error("PDF export failed:", error);
  } finally {
    // Restore buttons
    backup.forEach(({ element, display }) => {
      element.style.display = display;
    });
  }
};
