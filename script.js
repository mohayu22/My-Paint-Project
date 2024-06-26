document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - document.querySelector('nav').offsetHeight;

    let isDrawing = false;
    let startX = 0;
    let startY = 0;
    let currentTool = 'rectangle';
    let color = '#000000';
    let thickness = 1;

    const toolbar = {
        rectangle: document.getElementById('rectangle'),
        circle: document.getElementById('circle'),
        line: document.getElementById('line'),
        colorPicker: document.getElementById('colorPicker'),
        thickness: document.getElementById('thickness'),
        clear: document.getElementById('clear')
    };

    toolbar.rectangle.addEventListener('click', () => currentTool = 'rectangle');
    toolbar.circle.addEventListener('click', () => currentTool = 'circle');
    toolbar.line.addEventListener('click', () => currentTool = 'line');
    toolbar.colorPicker.addEventListener('change', (e) => color = e.target.value);
    toolbar.thickness.addEventListener('input', (e) => thickness = e.target.value);
    toolbar.clear.addEventListener('click', clearCanvas);

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    const shapes = [];

    function startDrawing(e) {
        isDrawing = true;
        startX = e.offsetX;
        startY = e.offsetY;
    }

    function draw(e) {
        if (!isDrawing) return;

        const currentX = e.offsetX;
        const currentY = e.offsetY;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawAllShapes();

        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = thickness;

        if (currentTool === 'rectangle') {
            const width = currentX - startX;
            const height = currentY - startY;
            ctx.strokeRect(startX, startY, width, height);
        } else if (currentTool === 'circle') {
            const radius = Math.sqrt(Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2));
            ctx.beginPath();
            ctx.arc(startX, startY, radius, 0, Math.PI * 2);
            ctx.stroke();
        } else if (currentTool === 'line') {
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(currentX, currentY);
            ctx.stroke();
        }
    }

    function stopDrawing(e) {
        if (!isDrawing) return;

        isDrawing = false;
        const endX = e.offsetX;
        const endY = e.offsetY;

        ctx.strokeStyle = color;
        ctx.fillStyle = color;

        if (currentTool === 'rectangle') {
            const width = endX - startX;
            const height = endY - startY;
            shapes.push({ tool: 'rectangle', x: startX, y: startY, width, height, color, thickness });
        } else if (currentTool === 'circle') {
            const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
            shapes.push({ tool: 'circle', x: startX, y: startY, radius, color, thickness });
        } else if (currentTool === 'line') {
            shapes.push({ tool: 'line', startX, startY, endX, endY, color, thickness });
        }

        drawAllShapes();
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        shapes.length = 0;
    }

    function drawAllShapes() {
        shapes.forEach(shape => {
            ctx.strokeStyle = shape.color;
            ctx.fillStyle = shape.color;
            ctx.lineWidth = shape.thickness;

            if (shape.tool === 'rectangle') {
                ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            } else if (shape.tool === 'circle') {
                ctx.beginPath();
                ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
                ctx.stroke();
            } else if (shape.tool === 'line') {
                ctx.beginPath();
                ctx.moveTo(shape.startX, shape.startY);
                ctx.lineTo(shape.endX, shape.endY);
                ctx.stroke();
            }
        });
    }

    function drawInitialHouse() {
        // Drawing the base of the house
        shapes.push({ tool: 'rectangle', x: 300, y: 400, width: 200, height: 150, color: '#8B4513', thickness: 2 });
        
        // Drawing the roof
        shapes.push({ tool: 'line', startX: 280, startY: 400, endX: 400, endY: 300, color: '#A52A2A', thickness: 2 });
        shapes.push({ tool: 'line', startX: 400, startY: 300, endX: 520, endY: 400, color: '#A52A2A', thickness: 2 });

        // Drawing the door
        shapes.push({ tool: 'rectangle', x: 370, y: 480, width: 60, height: 70, color: '#654321', thickness: 2 });

        // Drawing windows
        shapes.push({ tool: 'rectangle', x: 320, y: 420, width: 40, height: 40, color: '#87CEEB', thickness: 2 });
        shapes.push({ tool: 'rectangle', x: 440, y: 420, width: 40, height: 40, color: '#87CEEB', thickness: 2 });

        drawAllShapes();
    }

    drawInitialHouse();
});
