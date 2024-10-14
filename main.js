import * as THREE from 'three';

const CAMERA_POSITION_Z = 4;
const MAX_SCALE_SHAPE = 2;
const DEFAULT_SCALE = 0;
const container = [...document.querySelectorAll('.canvas')];
const typesGeometryElements = [new THREE.BoxGeometry(1, 1, 1, 10, 10, 10),new THREE.CylinderGeometry( 1, 1, 1, 32 ),new THREE.TorusGeometry];
const arrayCoordinateClick = [];
const arrayCoordinateDbllick = [];
const canvasPostionToTopPageScrollCoordinate = [];
const containerWithRenderShapesAndProps = container.map(create3D).filter(el => el !== null);
window.addEventListener('click', (e) => arrayCoordinateClick.push({x:e.clientX, y: e.clientY}))   
document.addEventListener('scroll', scroll);
console.log('window inner width', window.innerWidth);
console.log('window inner height', window.innerHeight);

function create3D(canvas, id) { 
    const numberContainer = id + 1;
    const canvasParentContainer = document.querySelector(`.container-${numberContainer}`);
    console.log(canvasParentContainer)
    const geometry = typesGeometryElements[id];
    if (geometry) {
        const scene = new THREE.Scene();
        console.log(canvasParentContainer.offsetWidth)
        console.log()
        // const camera = new THREE.PerspectiveCamera(75, canvasParentContainer.offsetWidth / canvasParentContainer.offsetHeight, 0.1, 1000);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas });
        // renderer.setSize(canvasParentContainer.offsetWidth, canvasParentContainer.offsetHeight);
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
        renderer.setClearColor(0xffffff, 0)
        renderer.render(scene, camera);
        shapeAndOwnProps.scene = scene;
        shapeAndOwnProps.camera = camera;
        shapeAndOwnProps.render = () => renderer.render(scene, camera);
        shapeAndOwnProps.renderer = renderer;
        shapeAndOwnProps.updatAfterResize = () => { 
            updateCamera({camera, renderer})
        }
        // renderer.render(scene, camera);
        return shapeAndOwnProps;
    }
    return null;
}

// window.addEventListener('resize', () => [...document.querySelectorAll('.canvas')].forEach(canvas => {
//     // canvas.setAttribute('width', window.innerWidth);
//     // canvas.setAttribute('height', window.innerHeight);
//     canvas.style.height = `${window.innerHeight}px`;
//     canvas.style.width = `${window.innerWidth}px`;
// }));
function updateCoordinateAndSetNewRenderScrolling({canvas, renderer, camera}) { 
    // canvas.setAttribute('width', window.innerWidth);
    // canvas.setAttribute('height', window.innerHeight);
    canvas.style.height = `${window.innerHeight}px`;
    canvas.style.width = `${window.innerWidth}px`;
    updateCamera({renderer, camera})

}
const devicePixelRatio = window.devicePixelRatio;
console.log("Device Pixel Ratio: ", devicePixelRatio);
console.log(window.screen.width, window.screen.height);
console.log(window.screen.availWidth,window.screen.availHeight)
console.log('one click', arrayCoordinateClick);
console.log('dbl click', arrayCoordinateDbllick);
console.log('when fullScreenClick pageScroll canvasDistanceToTop, ', canvasPostionToTopPageScrollCoordinate);
function setPropsForShapeElement({ canvas, shape, camera }) {
    const pageScroll = window.scrollY;

    canvas.addEventListener('dblclick', (e) => {
        const pageScroll = window.scrollY;
        arrayCoordinateDbllick.push({ x: e.clientX, y: e.clientY });
        const isFullScreen = document.fullscreenElement !== null;
        if (isFullScreen) {
            // canvasPostionToTopPageScrollCoordinate.push({fullScreen: true,pageScroll: window.scrollY, canvasDistanceToTop: canvas.getBoundingClientRect().top + pageScroll, scrollToElement: canvas.getBoundingClientRect().top - pageScroll} );
            // console.log('second')

            document.exitFullscreen();
            // console.log('when fullScreenClick pageScroll canvasDistanceToTop, ', canvasPostionToTopPageScrollCoordinate);

        } else {
            // console.log('first')
            // canvasPostionToTopPageScrollCoordinate.push({fullScreen: false,pageScroll: window.scrollY, canvasDistanceToTop: canvas.getBoundingClientRect().top + pageScroll, scrollToElement: canvas.getBoundingClientRect().top - pageScroll});
            canvas.requestFullscreen();
            // console.log('when fullScreenClick pageScroll canvasDistanceToTop, ', canvasPostionToTopPageScrollCoordinate);

        }
        // поместить в условие когда будет преключение из полного режима в неполный
        // const canvasDistanceToTop = canvas.getBoundingClientRect().top + pageScroll;
        // const pageScroll = window.scrollY;
    })
    return {
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
}
function updatePropertyOfDistanceToCanvasElementAfterWindowResize(elementWithProps) { 
    const pageScroll = window.scrollY;
    elementWithProps.topDistanceToCanvasElement = elementWithProps.canvas.getBoundingClientRect().top + pageScroll; 
}
function updateCamera({camera, renderer}) { 
    const width = window.innerWidth;
    console.log('camera update')
    const height = window.innerHeight;
    camera.updateProjectionMatrix();
    camera.aspect = width / height;
    renderer.setSize(width, height)
}
function updateShapeSetsAndRenderSets() { 
    // containerWithRenderShapesAndProps.forEach(updateCoordinateAndSetNewRenderScrolling);
    //1 изменение размеров канвас при изменении окна. Делаем впервую очередь потому что нам нужно расчитать
    // расстояние до элементов канвас(они будут менять свою высоту и ширину - но нам важна  при расчете высота
    // для правильного определния расстояния от верхней части документа до элемента канвас, так как следующие
    // элементы канвас учитывают высоту предыдущих). На основании изменения высоты у нас будет расчитываться
    // расстояние до элемента, рассчитываться пересчение и проскроливание окна viewport внутри канвас элемента
    //  а также шаг сдвига shape внутри канвас, так как шаг напрямую зависит от высоты канвас.И просроливание окна
    // внутри канвас зависит от высоты элемента.Когда скрол окна будет больше чем высота элемента канвас после точки
    // пересечения(WindowY - scrollToElement >=0)  - определение условия точки пересечения, canvas.offsetheight - window.scrollY >= 0
    // - если больше нуля значит окно скролится в элементе, если условие не выполняется значит окно(его нижняя часть) -
    // проскролилиа элемент.
    // 2 пересчитываем после изменения канвас  расстояние от документа до канвас элементов(нам важно высчитаьть скрол до элемента)
    // - функция updatePropertyOfDistanceToCanvasElementAfterWindowResize
    // 3 пересчитваем положение shape внутри канвас. Если окно уменьшается - шаг сдвига shape увеличивается, так как
    // он прямопропорционален высоте элемента канвас. И наоборот - увеличивается окно,уменьшается шаг.
    // Поэтому при ресайзе кона мы видим как у нас при уменьшении окна - shape свдигаются в центр
    // и при увелечнии окна - shape сдвигаются в верхнюю часть элемента канвас
    
    containerWithRenderShapesAndProps.forEach(({ canvas,renderer, camera }) => { 
        // console.log('canvas', canvas)
        // canvas.style.height = `${window.innerHeight}px`; // далает тоже самое что и renderer.setSize - но эта функция изменяет больше облать видимости. Это видно при полном екране
        // canvas.style.width = `${window.innerWidth}px`;// далает тоже самое что и renderer.setSize - но эта функция изменяет больше облать видимости. Это видно при полном екране
        // renderer.setSize(window.innerWidth, window.innerHeight) // далает тоже самое что и кода выше,но дополнттельно меняет ратсягивает облать видиости на весь екран
        updateCamera({renderer, camera})
    })
    containerWithRenderShapesAndProps.forEach(updatePropertyOfDistanceToCanvasElementAfterWindowResize);
    containerWithRenderShapesAndProps.forEach(setPositionShapeDuringScrolling);
    
    // устанавдливаем новые координаты расположения элементов канвас при изменения размера окна
    // так как меняется расстояние до элемента от верхней части документа
    // (меняется высота екрана при повороте екрана)
    // containerWithRenderShapesAndProps.forEach(updatePropertyOfDistanceToCanvasElementAfterWindowResize);
    // перередериваем наши элементы отночительно расположения скрола окна к нашим целевым контейнерам
    // containerWithRenderShapesAndProps.forEach(setPositionShapeDuringScrolling);
//     containerWithRenderShapesAndProps.forEach((shapeWithProps) => {
//         updatePropertyOfDistanceToCanvasElementAfterWindowResize(shapeWithProps);
    //         setPositionShapeDuringScrolling(shapeWithProps)
    //добавить еще обновление матрицы render Элементов 
//     })
}
 
window.addEventListener('resize', updateShapeSetsAndRenderSets);
    
function setPositionShapeDuringScrolling(shapeWithProps) {
    
    const { canvas, shape, topDistanceToCanvasElement, positionProps, render } = shapeWithProps;
    console.log('SHAPE',shape)

   console.log('topdistance to canvasd', topDistanceToCanvasElement)
    const scrollY = window.scrollY;//window.pageYOffset
    const windowHeight = window.innerHeight;
    const maxDistanceToScrollInsideCanvas = canvas.offsetHeight;

    const {
        startPositionX,
        startPositionY,
        endPositionX,
        endPositionY,
    } = positionProps;
    if (topDistanceToCanvasElement - windowHeight >= 0) {
        // scrollY - (topDistanceToCanvasElement - windowHeight) === 0 значит скролл дошел до элемента- bottom wiew port совпал с верхней точкой целевого контейнера
        const scrollDistanceToCanvasElement = topDistanceToCanvasElement - windowHeight;
        if (scrollY - scrollDistanceToCanvasElement >= 0) {//здесь фиксированній размер - topDistanceToCanvasElement - windowHeight. Условие выполняетс когда боттом окна дошел о топа элемента.Тоесть мы доскролилии относительно нижнией точки окна
            console.log('event done')
            // доскролили до єлемента или проскролили его
            const scrollDistanceAfterWindowBottomEdgeIntersetionedWithCanvas = scrollY - scrollDistanceToCanvasElement;// расстояние когда боттом виндов пересек канвас
            if (maxDistanceToScrollInsideCanvas - scrollDistanceAfterWindowBottomEdgeIntersetionedWithCanvas >= 0) {
                // выполнится если мы скролим внутри элемента
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
                setShapePosition({shape, x: changePositionShapeByX, y: changePositionShapeByY });
                maxDistanceToScrollInsideCanvas === scrollDistanceInsideCanvas ? shapeWithProps.isShapeInCenter = true : shapeWithProps.isShapeInCenter = false;
            

                // if (scrollY - scrollDistanceToCanvasElement - maxDistanceToScrollInsideCanvas / 2 >= 0) {//высчитывание скрола внтри элемента когда мы до него дошли
                //     console.log('scroll in some distance inside element')
                //     // позиционируем элемент к центру
                //     // const stepY = Math.abs((endPositionY - startPositionY) / maxDistanceToScrollInsideCanvas);
                //     // const stepX = Math.abs((endPositionX - startPositionX) / maxDistanceToScrollInsideCanvas);
                //     // const changePositionShapeByX = startPositionX + stepX * scrollDistanceInsideCanvas;
                //     // const changePositionShapeByY = startPositionY - stepY * scrollDistanceInsideCanvas;
                //     // shape.position.x = changePositionShapeByX;
                //     // shape.position.y = changePositionShapeByY;
                //     setShapePosition({shape, x: changePositionShapeByX, y: changePositionShapeByY });
                //     maxDistanceToScrollInsideCanvas === scrollDistanceInsideCanvas ? shapeWithProps.isShapeInCenter = true : shapeWithProps.isShapeInCenter = false;
                // } else {
                //     // делаем видимым внутри левого врехнего угла

                // }
            } else {
                // мы проскролили канвас 
                setShapePosition({shape, x: endPositionX, y: endPositionY });
                shapeWithProps.isShapeInCenter = true;
                // мы проскролили элемент и ставим его в центр
                // можно его увелимчить
            }

        } else {
            setShapePosition({ shape, x: startPositionX, y: startPositionY });
        }

    } else {
        // Элемент видно и к нему не нужно скролить, так как он меньше высоты окна
        setShapePosition({ shape, x: endPositionX, y: endPositionY });
        shapeWithProps.isShapeInCenter = true;

    }
    render();
}
// window.addEventListener('mousemove', (e) => { //работает для 'click' события
//     console.log('mouseMove');
//     console.log('clientY', e.clientY);
//     console.log('windowSrcoll', window.scrollY)
//     console.log('pageY', e.pageY);//текущее положение курсора отноистельно всего документа
//     console.log('clientY === e.pageY', e.clientY === e.pageY);
//     console.log('e.pageY + window.scrollY',e.clientY + window.scrollY)
// })
function scroll(e) {
    console.log('scroll')
    // console.log( e.clientY);не работает
    // console.log('pageY', e.pageY)не работает
    // console.log('e.clientY',e.clientY)не работает
    // console.log('e.screenY',e.screenY)не работает

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
function animateScaling(shapeWithProps, step) { 
    const stepToScale = step / 500;
    const stepToUnScale = step / 100
    const { isShapeInCenter, shape } = shapeWithProps;
    const isScale = isShapeInCenter;
    const zPosition = shape.position.z; 
    switch (isScale) { 
        case true:
            MAX_SCALE_SHAPE >= zPosition + stepToScale ? shape.position.z += stepToScale: shape.position.z = MAX_SCALE_SHAPE;
            return;
        case false:
            zPosition - stepToUnScale > DEFAULT_SCALE ? shape.position.z -= stepToUnScale : shape.position.z = DEFAULT_SCALE;
            return;
    }
}
function setAnimationProps(shapeWithProps, delta) { 

    const { shape, render} = shapeWithProps;
    const step =  0.01 * delta / 10;
    shape.rotation.y += step;
     shape.rotation.x += step ;

    animateScaling(shapeWithProps, delta);
    // console.log('animation shape', shape)
    // console.log('work')
        // cube.rotation.y += 0.01;
    // cube.rotation.z += 0.01;
    // cube.position.x = Math.sin(clock.getElapsedTime())
    // cube.position.y = Math.cos(clock.getElapsedTime())
    render();
}

let nowTime = Date.now();
function animate() {
    const currentTime = Date.now();
    const delta = currentTime - nowTime;
    nowTime = currentTime;
    containerWithRenderShapesAndProps.forEach((shapeWithProps) => setAnimationProps(shapeWithProps, delta));
    window.requestAnimationFrame(animate);
}
window.requestAnimationFrame(animate);
// treee js /////////////////////////////////

function moveCameraDuringMouseMoveInFullscreen(e) { 
    const 
}