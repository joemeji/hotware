export function getFileIconPath(ext: any) {
  let _ext = ext.toLowerCase();

  if (_ext === "xlsx" || _ext === "xls") {
    return "/file-icons/xls.png";
  }

  if (_ext === "docx" || _ext === "doc" || _ext === "txt") {
    return "/file-icons/txt.png";
  }

  if (_ext === "pptx" || _ext === "ppt") {
    return "/file-icons/ppt.png";
  }

  if (_ext === "pdf") {
    return "/file-icons/pdf.png";
  }

  if (_ext === "mp4") {
    return "/file-icons/mp4.png";
  }

  if (_ext === "mp3") {
    return "/file-icons/mp3.png";
  }

  if (_ext === "jpg") {
    return "/file-icons/jpg.png";
  }

  if (_ext === "png") {
    return "/file-icons/png.png";
  }

  if (_ext === "rar" || _ext === "zip") {
    return "/file-icons/zip.png";
  }

  return "/file-icons/unknown.png";
}
