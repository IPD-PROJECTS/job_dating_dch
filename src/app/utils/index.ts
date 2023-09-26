function removeWhiteSpaceAndSpecialCaracters(text: string): string {
    return text.replace(/[^a-zA-Z0-9]/g, '_');
  }
  export function getNewFilename(file: File) {
    const fileNameAndExtensions = file.name.split('.');
    const extension = fileNameAndExtensions[fileNameAndExtensions.length - 1];
    fileNameAndExtensions.pop();
    const newFileName = removeWhiteSpaceAndSpecialCaracters(fileNameAndExtensions.join('')) + '_' + new Date().getTime();
    return newFileName + '.' + extension;
  }