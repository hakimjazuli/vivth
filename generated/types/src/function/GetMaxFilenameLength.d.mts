/**
 * @description
 * Get OS-specific max filename length.
 * On POSIX: fs.constants.NAME_MAX
 * On Windows: 255 (per component, unless long paths enabled)
 * @returns {number}
 */
export function GetMaxFilenameLength(): number;
