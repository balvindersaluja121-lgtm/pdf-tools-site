let endpoint = "";

switch(toolId) {

  case "pdf-to-word":
    endpoint = "/pdf/pdf-to-word";
    break;

  case "jpg-to-pdf":
    endpoint = "/pdf/jpg-to-pdf";
    break;

  case "pdf-to-jpg":
    endpoint = "/pdf/pdf-to-jpg";
    break;

  case "merge-pdf":
    endpoint = "/pdf/merge-pdf";
    break;

  case "split-pdf":
    endpoint = "/pdf/split-pdf";
    break;

  case "compress-pdf":
    endpoint = "/pdf/compress-pdf";
    break;

  case "protect-pdf":
    endpoint = "/pdf/protect-pdf";
    break;

  case "unlock-pdf":
    endpoint = "/pdf/unlock-pdf";
    break;

  default:
    endpoint = "/pdf/pdf-to-word";
}

const response = await fetch(`${API}${endpoint}`, {
  method: "POST",
  body: formData
});
