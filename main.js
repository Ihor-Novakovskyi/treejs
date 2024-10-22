import * as THREE from 'three';
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent); 
const CAMERA_POSITION_Z = isMobile ? 7 : 5;
const MAX_SCALE_SHAPE = 2.5; //position shape by z axxis when element scale
const DEFAULT_SCALE = 0;
const container = [...document.querySelectorAll('.canvas')];
const typesGeometryElements = [new THREE.TetrahedronGeometry(1, 0),new THREE.BoxGeometry(1, 1, 1, 10, 10, 10), new THREE.CylinderGeometry(1, 1, 1, 32), new THREE.TorusGeometry];
const containerWithRenderShapesAndProps = container.map(create3DShapeWithOwnPropsShapeWithOwnProps).filter(el => el !== null);
containerWithRenderShapesAndProps.forEach(setPositionShapeDuringScrolling)
document.addEventListener('scroll', scroll);
window.addEventListener('resize', updateShapeSetsAndRenderSetsAfterResize);

function create3DShapeWithOwnPropsShapeWithOwnProps(canvas, id) {
    const numberContainer = id;
    const canvasParentContainer = document.querySelector(`.container-${numberContainer}`);
    const geometry = typesGeometryElements[id];
    if (geometry) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas });
        renderer.setSize(window.innerWidth, window.innerHeight);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
        const shape = new THREE.Mesh(geometry, material);
        const shapeAndOwnProps = setPropsForShapeElement({ canvas, shape, camera, renderer });
        const { positionProps: { startPositionX, startPositionY } } = shapeAndOwnProps;
        scene.add(shape);
        scene.add(camera);
        camera.position.z = CAMERA_POSITION_Z;
        shape.position.x = startPositionX;
        shape.position.y = startPositionY;
        renderer.setClearColor(0xffffff, 0);
        renderer.render(scene, camera);
        shapeAndOwnProps.scene = scene;
        shapeAndOwnProps.camera = camera;
        shapeAndOwnProps.render = () => renderer.render(scene, camera);
        shapeAndOwnProps.setDefaultPositionCameraAfterMouseMove = () => returnDefaultPositionCameraAfterFullScreen(camera);
        shapeAndOwnProps.renderer = renderer;
        shapeAndOwnProps.updateCameraRatioAfterResize = () => {
            updateCamera({ camera, renderer })
        };
        renderer.render(scene, camera);
        return shapeAndOwnProps;
    }
    return null;
}

function setPropsForShapeElement({ canvas, shape, camera }) {
    let isDblTouchForMobileDevice = false;
    const pageScroll = window.scrollY;
    const shapeAndOwnProps = {
        positionProps: {
            startPositionX: -10,
            startPositionY: 4,
            endPositionX: 0,
            endPositionY: 0,
        },
        isShapeInCenter: false,
        canvas,
        shape,
        camera,
        topDistanceToCanvasElement: canvas.getBoundingClientRect().top + pageScroll,// исправить на канвас а чилдрен єто сама фигура
    }

    isMobile ?
        canvas.addEventListener('touchstart', dblClickCheckerAndFullScreenModeController)
        :
        (canvas.addEventListener('mousemove', moveElementInFullScreenMode),
        canvas.addEventListener('dblclick', controllFullScreenMode));
    
    function dblClickCheckerAndFullScreenModeController() { 
        if (isDblTouchForMobileDevice) {
            isDblTouchForMobileDevice = false;
            controllFullScreenMode();
        } else { 
            isDblTouchForMobileDevice = true;
            setTimeout(() => isDblTouchForMobileDevice = false, 200);
        }
    }

    function controllFullScreenMode(e) {
        const { isShapeInCenter } = shapeAndOwnProps;
        const isFullScreen = document.fullscreenElement !== null;
        if (isFullScreen) {
            closeFullScreenMode();
        } else {
            isShapeInCenter ? canvas.requestFullscreen() : void 0;
        }
    }
    function moveElementInFullScreenMode(e) { 
        const { clientX, clientY } = e;
        const { isShapeInCenter } = shapeAndOwnProps;
        const canvasInFullScreen = document.fullscreenElement === canvas;
        isShapeInCenter && canvasInFullScreen ? moveCameraDuringMouseMoveInFullscreen({ camera, clientX, clientY, shape }) : void 0;
    }
    return shapeAndOwnProps;

}

function updatePropertyOfDistanceToCanvasElementAfterWindowResize(elementWithProps) {
    const pageScroll = window.scrollY;
    elementWithProps.topDistanceToCanvasElement = elementWithProps.canvas.getBoundingClientRect().top + pageScroll;
}
function updateCamera({ camera, renderer }) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.updateProjectionMatrix();
    camera.aspect = width / height;
    renderer.setSize(width, height);
}
function changeBackgroundCanvasBetweenFullScreeenAndDefaultScreen({ renderer, canvas }) {
    const isElementInFullScreen = document.fullscreenElement === canvas ? true : false;
    isElementInFullScreen ? renderer.setClearColor(0x000000) : renderer.setClearColor(0xffffff, 0);
}
function updateShapeSetsAndRenderSetsAfterResize() {
    containerWithRenderShapesAndProps.forEach((shapeAndOwnProps) => {
        const { setDefaultPositionCameraAfterMouseMove, updateCameraRatioAfterResize, renderer, canvas } = shapeAndOwnProps;
        changeBackgroundCanvasBetweenFullScreeenAndDefaultScreen({ renderer, canvas });
        setDefaultPositionCameraAfterMouseMove();
        updateCameraRatioAfterResize();
        updatePropertyOfDistanceToCanvasElementAfterWindowResize(shapeAndOwnProps);
        setPositionShapeDuringScrolling(shapeAndOwnProps);
    })
}


function setPositionShapeDuringScrolling(shapeAndOwnProps) {
    const { canvas, shape, topDistanceToCanvasElement, positionProps, render } = shapeAndOwnProps;
    const scrollY = window.scrollY;//window.pageYOffset
    const windowHeight = window.innerHeight;
    const maxDistanceToScrollInsideCanvas = canvas.offsetHeight;
    const {
        startPositionX,
        startPositionY,
        endPositionX,
        endPositionY,
    } = positionProps;
    if (topDistanceToCanvasElement >= windowHeight ) {
        // scrollY - (topDistanceToCanvasElement - windowHeight) === 0 значит скролл дошел до элемента- bottom wiew port совпал с верхней точкой целевого контейнера
        const scrollDistanceToCanvasElement = topDistanceToCanvasElement - windowHeight;
        if (scrollY - scrollDistanceToCanvasElement >= 0) {//здесь фиксированній размер - topDistanceToCanvasElement - windowHeight. Условие выполняетс когда боттом окна дошел о топа элемента.Тоесть мы доскролилии относительно нижнией точки окна
            // доскролили до єлемента или проскролили его
            const scrollDistanceAfterWindowBottomEdgeIntersetionedWithCanvas = scrollY - scrollDistanceToCanvasElement;// расстояние когда боттом виндов пересек канвас
            // Рассматриваем точку пересечения как начало точки отсчета - тоесть 0, после того как окно пересеклось и начало идти от границы пересечения  
            if (maxDistanceToScrollInsideCanvas - scrollDistanceAfterWindowBottomEdgeIntersetionedWithCanvas >= 0) {
                // условие выполняется если мы скролим внутри элемента
                const scrollDistanceInsideCanvas = scrollDistanceAfterWindowBottomEdgeIntersetionedWithCanvas;
                const { changePositionShapeByX, changePositionShapeByY } = calculateShapePositionDuringScroling({
                    endPositionY,
                    startPositionY,
                    endPositionX,
                    startPositionX,
                    maxDistanceToScrollInsideCanvas,
                    scrollDistanceInsideCanvas
                });
                setShapePosition({ shape, x: changePositionShapeByX, y: changePositionShapeByY });
                maxDistanceToScrollInsideCanvas === scrollDistanceInsideCanvas ? shapeAndOwnProps.isShapeInCenter = true : shapeAndOwnProps.isShapeInCenter = false;

            } else {
                // мы проскролили канвас 
                setShapePosition({ shape, x: endPositionX, y: endPositionY });
                shapeAndOwnProps.isShapeInCenter = true;
                // мы проскролили элемент и ставим его в центр
                // можно его увелимчить
            }

        } else {
            setShapePosition({ shape, x: startPositionX, y: startPositionY });
        }

    } else {
        // Элемент видно и к нему не нужно скролить, так как он виден в окне
        setShapePosition({ shape, x: endPositionX, y: endPositionY });
        shapeAndOwnProps.isShapeInCenter = true;

    }
    render();
}

function scroll() {
    containerWithRenderShapesAndProps.forEach(setPositionShapeDuringScrolling)
}
function setShapePosition({
    shape,
    x,
    y
}) {
    shape.position.x = x;
    shape.position.y = y;
}
function calculateShapePositionDuringScroling({
    endPositionY,
    startPositionY,
    endPositionX,
    startPositionX,
    maxDistanceToScrollInsideCanvas,
    scrollDistanceInsideCanvas
}) {
    const stepY = Math.abs((endPositionY - startPositionY) / maxDistanceToScrollInsideCanvas);
    const stepX = Math.abs((endPositionX - startPositionX) / maxDistanceToScrollInsideCanvas);
    const changePositionShapeByX = startPositionX + stepX * scrollDistanceInsideCanvas;
    const changePositionShapeByY = startPositionY - stepY * scrollDistanceInsideCanvas;
    return { changePositionShapeByX, changePositionShapeByY };
}
function animateScaling(shapeAndOwnProps, step) {
    const stepToScale = step / 500;
    const stepToUnScale = step / 100
    const { isShapeInCenter, shape } = shapeAndOwnProps;
    const isScale = isShapeInCenter;
    const zPosition = shape.position.z;
    switch (isScale) {
        case true:
            MAX_SCALE_SHAPE >= zPosition + stepToScale ? shape.position.z += stepToScale : shape.position.z = MAX_SCALE_SHAPE;
            return;
        case false:
            zPosition - stepToUnScale > DEFAULT_SCALE ? shape.position.z -= stepToUnScale : shape.position.z = DEFAULT_SCALE;
            return;
    }
}
function setAnimationProps(shapeAndOwnProps, delta) {

    const { shape, render } = shapeAndOwnProps;
    const step = 0.01 * delta / 10;
    shape.rotation.y += step;
    shape.rotation.x += step;
    animateScaling(shapeAndOwnProps, delta);
    render();
}

let nowTime = Date.now();
function animate() {
    const currentTime = Date.now();
    const delta = currentTime - nowTime;
    nowTime = currentTime;
    containerWithRenderShapesAndProps.forEach((shapeAndOwnProps) => setAnimationProps(shapeAndOwnProps, delta));
    window.requestAnimationFrame(animate);
}
window.requestAnimationFrame(animate);
// treee js /////////////////////////////////

function moveCameraDuringMouseMoveInFullscreen({ clientX, clientY, camera, shape }) {
    
    const normolizeX = (clientX / window.innerWidth) - 0.5;
    const normolizeY = (clientY / window.innerHeight) - 0.5;
    camera.rotation.y = normolizeX;
    camera.rotation.x = normolizeY;
}
function returnDefaultPositionCameraAfterFullScreen(camera) {
    camera.rotation.y = 0;
    camera.rotation.x = 0;
}
function closeFullScreenMode() { 
    const isElementInFullScreen = document.fullscreenElement !== null;
    isElementInFullScreen ? document.exitFullscreen() : void 0;
}
function createElementForLoadPage() {
    const typesGeometryElements = [new THREE.BoxGeometry(1, 1, 1, 10, 10, 10), new THREE.CylinderGeometry(1, 1, 1, 32), new THREE.TorusGeometry];
    const position = [{ startAngle: Math.round(120 / 57.3) }, { startAngle: Math.round(240 / 57.3) }, { startAngle: Math.round(360 / 57.3)}];
    const group = new THREE.Group();    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const canvas = document.querySelector('.load-animation');
    const renderer = new THREE.WebGLRenderer({ canvas });
    let isMovingToCenter = true;
    const maxRadiusDistance = 4;
    const minRadiusDistance = 1;
    let movingDistance = maxRadiusDistance;
    const stepToCenterMove = 0.01;
    const stepToLeaveCenterMove = 0.05;
    let isLoadPageOpen = true;
    let userCanCloseLoadPageAfterDelay = false;
    let date = Date.now();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    typesGeometryElements.forEach(geometry => { 
        const shape = new THREE.Mesh(geometry, material);
        group.add(shape);
    })
    scene.add(group);
    scene.add(camera);
    camera.position.z = isMobile ? 13 : 8;
    renderer.render(scene, camera);
    document.body.style.overflow = 'hidden';
    canvas.addEventListener('mousemove', leaveCenterWhenMouseMove);
    setTimeout(delayBeforeUserCanCloseLoadingPage, 4000);
    canvas.addEventListener('click', loadPageFullScreenController);
    window.addEventListener('resize', updateCameraLoadPageWhenResize);
    animateRotation();

    function updatePositionShapes({geometry, id , tick}) { 
        geometry.position.x = movingDistance * Math.cos(((tick / 1000) + position[id].startAngle));
        geometry.position.y = movingDistance * Math.sin(((tick / 1000) + position[id].startAngle));
        geometry.rotation.x += 0.01;
        geometry.rotation.z += 0.01;
    }
    
    function animateRotation(tick) {   
        const currentDate = Date.now();
        const delta = currentDate - date;
        date = currentDate;
        if (isLoadPageOpen) {
            if (minRadiusDistance > movingDistance - stepToCenterMove) {
                isMovingToCenter = false;
            } else if (movingDistance + stepToLeaveCenterMove > maxRadiusDistance) {
                isMovingToCenter = true;
            }
            if (isMovingToCenter) {
                //300 количесвто циклов по прибилижению элементров к ценру осей
                movingDistance -= stepToCenterMove;
                camera.position.z -= 0.02;
            } else {
                movingDistance += stepToLeaveCenterMove;
                //60 количество циклов выполнения условия по достижению удаления элемнта
                camera.position.z += 0.1
            }
            const { children } = group;
            children.forEach((geometry, id) => updatePositionShapes({geometry, id, tick}));
            renderer.render(scene, camera);
            window.requestAnimationFrame(animateRotation);
        } else { 
            closeFullScreenMode();
            deleteContainerWithCanvasAnimation();
            window.removeEventListener('resize', updateCameraLoadPageWhenResize);
        }
    }
    function deleteContainerWithCanvasAnimation() { 
        document.querySelector('.load-page').remove();
    }
    function leaveCenterWhenMouseMove() { 
        isMovingToCenter = false;
    }

    function loadPageFullScreenController() { 
        userCanCloseLoadPageAfterDelay ? closeLoadPageAndExitFullScreen() : openLoadPageInFullScreen();
    }
    function closeLoadPageAndExitFullScreen() {
        const isLoadPageInFullScreen = !!document.fullscreenElement; 
        isLoadPageOpen = false;     
        isLoadPageInFullScreen ? closeFullScreenMode() : void 0;
        document.body.style.overflow = '';
    }
    function openLoadPageInFullScreen() { 
        const isLoadPageInFullScreen = !document.fullscreenElement; 
        isLoadPageOpen && isLoadPageInFullScreen ? canvas.requestFullscreen() : void 0; 
    }
    function delayBeforeUserCanCloseLoadingPage() { 
        userCanCloseLoadPageAfterDelay = true;
    }
    function updateCameraLoadPageWhenResize() { 
        updateCamera({ camera, renderer });
    }
  
}
createElementForLoadPage();
