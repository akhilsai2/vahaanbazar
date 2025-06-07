"use client";
const Loader = () => {
  return (
    <div className={`d-flex justify-content-center align-items-center h-100 w-100 `}>
      <div className="loader"></div>
    </div>
  );
};

export default Loader;
//   export function OverlayLoader(props) {
//     return (
//       <div className="loader-container h-100">
//         <div className={`loader-overlay ${props.className ?? ''}`}>
//           <div className="loader"></div>
//         </div>
//       </div>
//     );
// }
