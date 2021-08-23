export default function Loader({ isShown }) {
  return isShown ? <div className={"loader"} /> : null;
}
