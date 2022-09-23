import React from "react";

const Card = ({image, value, suit}) => {
  return (
    <>
      <img src={image} alt={`${value} of ${suit}`}></img>
    </>
  )
}

export default Card