import * as THREE from 'three';
console.log(document.querySelectorAll('.container'))
const container = [...document.querySelectorAll('.container')];
const containersWithtargetElementAndHisChildren = container
    .map((parent) => ({ parent, children: parent.querySelector('.canvas-element') }));

function setCanvasElementCenterPosition({ parent, children }) {
    const pageScroll = window.scrollY;
    const targetElement = children;
    const heightParentElement = parent.scrollHeight;
    const widthParentElement = parent.scrollWidth;
    const heightTargetElement = targetElement.scrollHeight;
    const widthTargetElement = targetElement.scrollWidth;
    const distanceToPositionTargetelementInCenterVertical = (heightParentElement / 2) - (heightTargetElement / 2);
    const distanceToPositionTragetElementInCenterHorisontal = (widthParentElement / 2) - (widthTargetElement / 2);

    return {
        sizeToCenterElementInParentX: distanceToPositionTragetElementInCenterHorisontal,
        sizeToCenterElementInParentY: distanceToPositionTargetelementInCenterVertical,
        parent,
        children,
        topDistanceToParent: parent.getBoundingClientRect().top + pageScroll,
    }
}
let containersWithTargetElementHisChildrenAndProps = containersWithtargetElementAndHisChildren.map(setCanvasElementCenterPosition);
window.addEventListener('resize', () => {
    containersWithTargetElementHisChildrenAndProps = containersWithtargetElementAndHisChildren.map(setCanvasElementCenterPosition);
});
containersWithTargetElementHisChildrenAndProps.forEach(setCoordinatesToMoveChidlrenInParentContainerDuringPageIsScrolling)
function setCoordinatesToMoveChidlrenInParentContainerDuringPageIsScrolling({ sizeToCenterElementInParentX, sizeToCenterElementInParentY, parent, children: targetElement, topDistanceToParent: topContainer }) {
    console.log('windowScrollY', window.scrollY)
    console.log('window pageYoffset', window.pageYOffset)
    const scrollY = window.scrollY;//window.pageYOffset
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    if (topContainer - windowHeight >= 0) {
        // scrollY - (topContainer - windowHeight) === 0 значит скролл дошел до элемента- bottom wiew port совпал с верхней точкой целевого контейнера
        if (scrollY - (topContainer - windowHeight) >= 0) {//здесь фиксированній размер - topContainer - windowHeight. Условие выполняетс когда боттом окна дошел о топа элемента.Тоесть мы доскролилии относительно нижнией точки окна
            if (scrollY - (topContainer - windowHeight) - targetElement.scrollHeight >= 0) {//высчитывание скрола внтри элемента когда мы до него дошли
                // будет выполняться если доскролен или уже проскролен()
                const offSet = (scrollY - (topContainer - windowHeight)) / 2; //делю на 2 чтоб медленней прокручивалось
                const x = (offSet / sizeToCenterElementInParentY) * sizeToCenterElementInParentX;//соотношение лучше всего брать отсюда
                console.log('weoksss')

                if (offSet <= sizeToCenterElementInParentY) {// условие, то сколько ты проскролил когда дошел до элемента, должно быть меншьше
                    // расстояния от вреха элемента до того момента чтоб дочерний расположился по центру элемента 
                    targetElement.style.transform = `translate(${x}px,${offSet}px)`
                    console.log('first condition')
                } else {
                    console.log('second condition')
                    targetElement.style.transform = `translate(${sizeToCenterElementInParentX}px,${sizeToCenterElementInParentY}px)`;
                }
                console.log('i`m inside container ')
            } else {
                // условие, когда элемент не доскролен, или мы полднялись выше него
                targetElement.style.transform = `translate(0px,0px)`;
            }
        } else {
            targetElement.style.transform = `translate(-100%,-100%)`;
        }

    } else {

        targetElement.style.transform = `translate(${sizeToCenterElementInParentX}px,${sizeToCenterElementInParentY}px)`;
    }
}
function scroll() {

    containersWithTargetElementHisChildrenAndProps.forEach(setCoordinatesToMoveChidlrenInParentContainerDuringPageIsScrolling)
}
document.addEventListener('scroll', scroll)

console.log('document scrollHeight ', document.documentElement.scrollHeight, 'document.documentElement.clientHeight', document.documentElement.clientHeight, 'body scrollHeight', document.body.scrollHeight, 'window.innerHeight', window.innerHeight)

// treee js /////////////////////////////////
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
console.log(camera instanceof THREE.PerspectiveCamera);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setAnimationLoop( animate );
document.body.appendChild(renderer.domElement);
console.log(0x00ff00)
const geometry = new THREE.BoxGeometry(1, 1, 1, 10, 10, 10);
// const geometry = new THREE.CircleGeometry(1,10);
// const geometry = new THREE.CylinderGeometry( 1, 1, 1, 64 );
// const geometry = new THREE.TorusGeometry( 1, 1, 16 , 100, 1 );
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
scene.add(camera);

camera.position.z = 6;
const cursorCoordinate = {
    x: 0,
    y: 0
};
renderer.render(scene, camera);
// setInterval(animate,16)
let nowTime = Date.now();
console.log(nowTime)
// window.requestAnimationFrame(animate);
let id = 0;
let timeBetweenRequestAnimationFrame = null;
const clock = new THREE.Clock();
let now = clock.getElapsedTime();//Фиксирует время во время инициализации и возвращает верменной прмежуток между
// начальной точкой отсчета - тоесть инциализацией и тукещем вызововом. что то на подобие const startTime = Date.now()
//  полсе чего возвращет разницу между Date.now() - startTime - при каждом вызове
function animate(time) {
    console.log('elipsedTime', clock.getElapsedTime() - now);
    now = clock.getElapsedTime();
    id++;
    !timeBetweenRequestAnimationFrame ? timeBetweenRequestAnimationFrame = time : void 0;
    console.log(time - timeBetweenRequestAnimationFrame);
    timeBetweenRequestAnimationFrame = time;
    const currentTime = Date.now();
    const delta = currentTime - nowTime;
    nowTime = currentTime;
    console.log('delta', delta);
    console.log('time give by requestAnimationFrame', time);
    console.log('getElipsedTime', clock.getElapsedTime())
    cube.rotation.x += 0.01;
    console.log(cube.scale.x, cube.scale.y)

    // cube.rotation.y += 0.01;
    // cube.rotation.z += 0.01;
    // cube.position.x = Math.sin(clock.getElapsedTime())
    // cube.position.y = Math.cos(clock.getElapsedTime())
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate)


}

// функция moving - может брать координаты из глобального объекта, а также может получать координаты при срабатвании
// события движения внутри элемента
// обработчик который задает координаты - может их сохранять в глобальном объекте, либо передавать непосредсвенно в 
// функцию moving. Работать єто будет одинаково
function moving(x = 0, y = 0) {
    cube.rotation.y = x;
    cube.rotation.x = y;
    // cube.rotation.y = cursorCoordinate.x;
    // cube.rotation.x = cursorCoordinate.y;
    console.log('tik')
    // camera.position.x = cursorCoordinate.x;
    // camera.position.y = cursorCoordinate.y;
    renderer.render(scene, camera);
}
// window.addEventListener('mousemove', (e) => {
//     const x = (e.clientX / window.innerWidth) * 2 - 1;

//     const y = (e.clientY / window.innerHeight) * 2 - 1;

//     console.log('x - ', x, 'y - ', y)
//     cursorCoordinate.x = x;
//     cursorCoordinate.y = y;
//     console.log(cursorCoordinate)
//     moving(x ,y)
//     // moving()
// })




// window.addEventListener('wheel', () => {
//     console.log('wheel')
//     animate()
// })
// console.log(
//     document.body.scrollHeight, document.documentElement.scrollHeight,
//     document.body.offsetHeight, document.documentElement.offsetHeight,
//     document.body.clientHeight,
//   )

// Нужно применять условие внизу потому что в разных браузерах может вычисляться по разному
// var scrollHeight = Math.max(
//     document.body.scrollHeight, document.documentElement.scrollHeight,
//     document.body.offsetHeight, document.documentElement.offsetHeight,
//     document.body.clientHeight, document.documentElement.clientHeight
//   );
// https://10-years.kota.co.uk/
// https://atomsworld.co.jp/
// https://videorbit.com/
// https://peptone.io/





// нормализация и анимация элемента при клике на элементе внутри элемента канвас
let activeElementProps = null;
const raycaster = new THREE.Raycaster();
renderer.render(scene, camera)
window.addEventListener('click', (e) => {
    const x = (e.clientX / window.innerWidth)  - 0.5;
    const y = -(e.clientY / window.innerHeight)  + 0.5;
    // console.log('x - normolise', x);
    // console.log('y - normolise', y);
    const pointer = new THREE.Vector2();
    pointer.x = x;
    pointer.y = y;
    raycaster.setFromCamera(pointer, camera);
    const intersection = raycaster.intersectObject(cube);
    console.log(intersection);
    console.log(cube)
    if (intersection.length) {
        const [{ object: activeElement }] = intersection;
        console.log('activeElement',activeElement);
        if (activeElementProps !== null) {
            const prevactiveElement = activeElementProps.activeElement;
            if (activeElement === prevactiveElement) {
                console.log(true)
                resetPropsAndSetStartPositionPrevActiveElement();
                renderer.render(scene, camera)
            } else {
                resetPropsAndSetStartPositionPrevActiveElement();
                setActiveElement(activeElement);
                startAnimationActiveElement(activeElement);
            }
        } else {
            setActiveElement(activeElement);
            startAnimationActiveElement();
        }
        

    } else { 
        if (activeElementProps !== null) { 
            resetPropsAndSetStartPositionPrevActiveElement();
            renderer.render(scene, camera)
        }
    }
})


function resetPropsAndSetStartPositionPrevActiveElement(activeElement = activeElementProps.activeElement, position = activeElementProps.position) {
    // const { activeElement, position } = prevActiveElement;
    const { x, y, z } = position;
    console.log('x - ',x ,'y- ', y, z)
    activeElement.material.color.set(0x00ff00);
    activeElement.position.set(x, y, z);
    activeElement.rotation.set(0, 0 , 0)
    activeElementProps = null;
}
//утсанавливает активный элемент
function setActiveElement(element) {
    activeElementProps = { activeElement: element, position: {...element.position} };
}
// устанавливает анимацию
function startAnimationActiveElement() {
    const rotateElement = createRotationWrapper();
    rotateElement();
}

function createRotationWrapper() { 
    // создаем функцию обертку для того чтобы инициализировать начальную точку отсчета времени начала анимации

    let startTime = Date.now();
    return function rotateElement() {
        const isAvtiveElement = !!activeElementProps;
        if (isAvtiveElement) {
            const z = 4;
            const { activeElement } = activeElementProps;
            const current = Date.now();
            const delta = current - startTime;
            startTime = current;
            activeElement.rotation.x += delta / 1000;
            activeElement.rotation.y += delta / 1000;
            if ( activeElement.position.z <= z) {
                activeElement.position.z += delta / 1000;
    
            }
            renderer.render(scene, camera);
            window.requestAnimationFrame(rotateElement);
         }
        
    }
}
function goBackPrevActiveElementAndStartAnimateNewElementWrapper(prevElement, startPositionPrevElement,activeElement = null) { 
    let startTime = Date.now();
    const { x, y, z } = startPositionPrevElement;
    function goBackPrevActiveElementAndStartAnimateNewElement() {
        const currentTime = Date.now();
        const delta = currentTime - startTime;
        startTime = currentTime;
        if (prevElement.position.z > 0) {
            prevElement.position.z -= delta / 1000;
            activeElement.rotation.x += delta / 1000;
            activeElement.rotation.y += delta / 1000;
            renderer.render(scene, camera)
            window.requestAnimationFrame(goBackPrevActiveElementAndStartAnimateNewElement)
        }
        else { 
            resetPropsAndSetStartPositionPrevActiveElement(prevElement, startPositionPrevElement);
            setActiveElement(activeElement);
            startAnimationActiveElement();
        }
    }
}