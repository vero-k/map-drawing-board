import React, { useRef, useEffect, useState } from 'react';


export default function LayerCanvas(props) {

  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const [currentColor, setCurrentColor] = useState("#000000");
  const [size, setSize] = useState(5);

  const [menuOpen, setMenuOpen] = useState(false);

  const [zoom, setZoom] = useState(100);
  const [panx, setPanx] = useState(0.0);
  const [pany, setPany] = useState(0.0);

  const [scale, setScale] = useState(1);
  const [originX, setOriginX] = useState(0);
  const [originY, setOriginY] = useState(0);

  const [startPanPoint, setStartPanPoint] = useState({ x: 0, y: 0 });
  const [mouseX, setMouseX] = useState()
  const [mouseY, setMouseY] = useState()

  const [isDrawing, setIsDrawing] = useState(false);

  const [drawings, setDrawings] = useState([]);


  const toggleMenuBttn = () => {
    setMenuOpen(prev =>!prev);
  }

  

  const handleColorChange = (e) => {
    setCurrentColor(e.target.value)
  }

  const handleSizeChange = (e) => {
    setSize(e.target.value)
  }

  const handleZoomChange = (e) => {
    setZoom(e.target.value);
    redrawCanvas()
  }

  const handlePanXChange = (e) => {
    setPanx(e.target.value)
    redrawCanvas()
  }

  const handlePanYChange = (e) => {
    setPany(e.target.value)
    redrawCanvas()
  }

  const handleWheelChange = (e) => {
    e.preventDefault();
  }

  const startDrawing = ({ nativeEvent }) => {
    const { clientX, clientY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(clientX, clientY);
    setIsDrawing(true);
    setDrawings([...drawings, { currentColor, size, points: [{ x: clientX, y: clientY }] }]);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }
    const { clientX, clientY } = nativeEvent;
    contextRef.current.lineTo(clientX, clientY);
    contextRef.current.stroke();

    const currentDrawing = drawings[drawings.length - 1];
    currentDrawing.points.push({ x: clientX, y: clientY });
    setDrawings([...drawings.slice(0, -1), currentDrawing]);
  };

  
  const calPanXVal = (val)  => {
    const half_windowwidth = window.innerWidth / 2;
    return (val / 10.0) * half_windowwidth
  }

  const calPanYVal = (val)  => {
    const half_windowheight = window.innerHeight / 2;
    return (val / 10.0) * half_windowheight
  }


  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    const panxVal = calPanXVal(panx)
    const panyVal = calPanYVal(pany)

    const zoomVal = zoom / 100.0;
    context.save()
    drawings.forEach((drawing) => {
      context.strokeStyle = drawing.currentColor;
      context.lineWidth = drawing.size;
      context.beginPath();
      drawing.points.forEach((point, index) => {
        if (index === 0) {
          context.moveTo(point.x * zoomVal + panxVal, point.y * zoomVal + panyVal);
        } else {
          context.lineTo(point.x * zoomVal + panxVal, point.y * zoomVal + panyVal);
        }
      });
      context.stroke();
    });
    context.restore()
  }


  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const context = canvas.getContext('2d');
    context.scale(1, 1); // Scale up for high DPI screens
    context.lineCap = "round";
    context.strokeStyle = currentColor;
    context.lineWidth = size;
    contextRef.current = context;

    redrawCanvas();

    /* const handleResize = () => {
      const newScale = window.innerWidth / canvas.width;
      setScale(newScale);
      redrawCanvas();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    }; */
  
  }, []);


  
  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.translate(originX, originY);
    }
  }, [originX, originY]);

  
  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = currentColor;
    }
  }, [currentColor]);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.lineWidth = size; // Adjust stroke size based on scale
    }
  }, [size]);


  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.scale(scale, scale);
    }
  }, [scale]);


  return (
    <React.Fragment>

      <button className="bttn toggleMenu" onClick={toggleMenuBttn}>☰</button>

      
      
        {
          menuOpen && 
          <div id="a-menu" className={menuOpen ? 'open' : ''}>

            <div className="menu-div menu-currentColor">
              <label htmlFor="currentColorMonitor">Color:</label>
              <input type="color" className="inputColor" id="colorPicker" value={currentColor} onChange={handleColorChange}/>
            </div>

            <div className="menu-div menu-currentSize">
              <label>Stroke Size:</label>
              <input
                  type="range"
                  min="1"
                  max="50"
                  value={size}
                  onChange={handleSizeChange}
                />

            </div>
            <div className="menu-div menu-zoom">
              <label>Zoom (%):</label>
              <input
                  type="range"
                  min="10"
                  max="200"
                  value={zoom}
                  onChange={handleZoomChange}
                />

            </div>
            <div className="menu-div menu-panx">
              <label>Horizontal Pan:</label>
              <input
                  type="range"
                  min="-10"
                  max="10"
                  value={panx}
                  onChange={handlePanXChange}
                />

            </div>
            <div className="menu-div menu-pany">
              <label>Vertical Pan:</label>
              <input
                  type="range"
                  min="-10"
                  max="10"
                  value={pany}
                  onChange={handlePanYChange}
                />

            </div>
          </div>
        }
        
        
      <canvas 
        id="a-canvas" 
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseOut={finishDrawing}
        onMouseMove={draw}
        onWheel={handleWheelChange}
        className={`${(props.activeLayer === 'canvas') ? 'activeboard':'inactiveboard'}`}  
      />

    </React.Fragment>
  );

}




/* const startDrawing = ({ nativeEvent }) => {
  const { offsetX, offsetY } = nativeEvent;
  contextRef.current.beginPath();
  contextRef.current.moveTo(offsetX, offsetY);
  setIsDrawing(true);
};

const finishDrawing = () => {
  contextRef.current.closePath();
  setIsDrawing(false);
  props.setStartDrawing(false);
  props.setStopDrawing(false);
  props.setIsDrawing(false);
};

const draw = ({ nativeEvent }) => {
  if (!isDrawing) {
    return;
  }
  const { offsetX, offsetY } = nativeEvent;
  contextRef.current.lineTo(offsetX, offsetY);
  contextRef.current.stroke();
};


const startPaning = ({ nativeEvent }) => {
  const { offsetX, offsetY } = nativeEvent;
  setStartPanPoint({ x: offsetX, y: offsetY });
}

const finishPaning = () => {
  props.setStopPaning(false);
  props.setStartPaning(false);
  props.setIsPaning(false);
  setIsPaning(false)
}

const pan = ({ nativeEvent }) => {
  if (!isDrawing) {
    return;
  }
  const { offsetX, offsetY } = nativeEvent;
  const deltaX = offsetX - startPanPoint.x;
  const deltaY = offsetY - startPanPoint.y;
  setStartPanPoint({ x: offsetX, y: offsetY });
  setOriginX(prevOriginX => prevOriginX + deltaX);
  setOriginY(prevOriginY => prevOriginY + deltaY);
}


const zoom = ({ nativeEvent }) => {
  const deltaY = props.mouseEvent;
    setScale(prevScale => {
      const newScale = Math.min(Math.max(0.5, prevScale - deltaY * 0.001), 3);
      return newScale;
    });
    props.setIsZooming(false);
}


useEffect(() => {
  console.log('in effects mouseevent')

  if(props.stopDrawing){
    finishDrawing()

/* const startDrawing = ({ nativeEvent }) => {
  const { offsetX, offsetY } = nativeEvent;
  contextRef.current.beginPath();
  contextRef.current.moveTo(offsetX, offsetY);
  setIsDrawing(true);
};

const finishDrawing = () => {
  contextRef.current.closePath();
  setIsDrawing(false);
  props.setStartDrawing(false);
  props.setStopDrawing(false);
  props.setIsDrawing(false);
};

const draw = ({ nativeEvent }) => {
  if (!isDrawing) {
    return;
  }
  const { offsetX, offsetY } = nativeEvent;
  contextRef.current.lineTo(offsetX, offsetY);
  contextRef.current.stroke();
};


const startPaning = ({ nativeEvent }) => {
  const { offsetX, offsetY } = nativeEvent;
  setStartPanPoint({ x: offsetX, y: offsetY });
}

const finishPaning = () => {
  props.setStopPaning(false);
  props.setStartPaning(false);
  props.setIsPaning(false);
  setIsPaning(false)
}

const pan = ({ nativeEvent }) => {
  if (!isDrawing) {
    return;
  }
  const { offsetX, offsetY } = nativeEvent;
  const deltaX = offsetX - startPanPoint.x;
  const deltaY = offsetY - startPanPoint.y;
  setStartPanPoint({ x: offsetX, y: offsetY });
  setOriginX(prevOriginX => prevOriginX + deltaX);
  setOriginY(prevOriginY => prevOriginY + deltaY);
}


const zoom = ({ nativeEvent }) => {
  const deltaY = props.mouseEvent;
    setScale(prevScale => {
      const newScale = Math.min(Math.max(0.5, prevScale - deltaY * 0.001), 3);
      return newScale;
    });
    props.setIsZooming(false);
}


useEffect(() => {
  console.log('in effects mouseevent')

  if(props.stopDrawing){
    finishDrawing()
  }else if(props.stopPaning){
    finishPaning()
  }else if(props.isDrawing){
    draw(props.mouseEvent)
  }else if(props.isPaning){
    pan(props.mouseEvent)
  }else if(props.startDrawing){
    startDrawing(props.mouseEvent)
  }else if(props.startPaning){
    startPaning(props.mouseEvent)
  }else if (props.isZooming){
    zoom(props.mouseEvent)
  }

  
}, [props.mouseEvent]);


useEffect(() => {
    
  const resizeCanvas = () => {
    // Redraw the canvas content if necessary
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth *2;
    canvas.height = window.innerHeight *2;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
  };
  // Add event listener to resize canvas when window is resized
  window.addEventListener('resize', resizeCanvas);

  // Cleanup event listener
  return () => {
    window.removeEventListener('resize', resizeCanvas);
  };
}, []); **/
    