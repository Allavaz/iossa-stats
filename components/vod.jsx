import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export default function Vod(props) {
  const [hovering, setHovering] = useState(false);

  return (
    <div
      onMouseOver={e => setHovering(true)}
      onMouseOut={e => setHovering(false)}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <h3>VIDEO DEL PARTIDO</h3>
        {props.editable ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "38px",
              marginLeft: "5px"
            }}
          >
            <FontAwesomeIcon
              icon={faEdit}
              style={{ cursor: "pointer", opacity: hovering ? "100%" : "0%" }}
              onClick={e => props.setEditing("vod")}
            />
            <FontAwesomeIcon
              icon={faTrashAlt}
              style={{ cursor: "pointer", opacity: hovering ? "100%" : "0%" }}
              onClick={e => props.changeVod(null)}
            />
          </div>
        ) : null}
      </div>
      <iframe
        title="vod"
        className="resp-iframe"
        src={"https://www.youtube.com/embed/" + props.vod}
        frameBorder="0"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}
