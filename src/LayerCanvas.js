import React, { useRef, useEffect, useState } from 'react';


export default function Canvas({data}) {

  const canvasRef = useRef(null);  
  useEffect(() => {
    
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    
    const draw = ctx => {
      ctx.fillStyle = '#000000'
      ctx.beginPath()
      ctx.arc(50, 100, 20, 0, 2*Math.PI)
      ctx.fill()
    }
    //Our draw come here
    draw(context)
  }, [])



  return (
      <canvas id="canvasID" ref={canvasRef} />
  );

}


