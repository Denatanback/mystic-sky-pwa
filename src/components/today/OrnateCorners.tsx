/* Renders 4 ornate L-bracket corners with a small dot inside each.
   Wrap any positioned element. */
export function OrnateCorners() {
  return (
    <>
      <span className="ornate-corner tl" aria-hidden="true" />
      <span className="ornate-corner tr" aria-hidden="true" />
      <span className="ornate-corner bl" aria-hidden="true" />
      <span className="ornate-corner br" aria-hidden="true" />
    </>
  );
}
