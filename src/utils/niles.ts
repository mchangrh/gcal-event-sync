/* code taken from Niles (https://github.com/niles-bot/niles)
    with some modifications
    Licenced under MIT
    Probably written my me anyways
*/

export function matchCalType(calendarID: string): boolean {
  // regex filter groups
  const groupCalId = RegExp("([a-z0-9]{26}@group.calendar.google.com)");
  const importCalId = RegExp("(^[a-z0-9]{32}@import.calendar.google.com)");
  const gmailAddress = RegExp("^([a-z0-9.]+@gmail.com)");
  const domainAddress = RegExp("(^[a-z0-9_.+-]+@[a-z0-9-]+.[a-z0-9-.]+$)");
  // filter through regex
  return (
    !gmailAddress.test(calendarID) ||
    !importCalId.test(calendarID) ||
    !groupCalId.test(calendarID) ||
    !domainAddress.test(calendarID)
  );
}
