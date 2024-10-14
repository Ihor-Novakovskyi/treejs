const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, document.querySelector('.div-wrapper').offsetWidth / window.innerHeight, 0.1, 1000);
console.log(camera instanceof THREE.PerspectiveCamera);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('.canvas'), });
renderer.setSize(document.querySelector('.div-wrapper').offsetWidth, window.innerHeight);

document.querySelector('.div-wrapper').appendChild(renderer.domElement);
// renderer.setAnimationLoop( animate );
// document.body.appendChild(renderer.domElement);
console.log(0x00ff00)
const geometry = new THREE.BoxGeometry(1, 1, 1, 10, 10, 10);
// const geometry = new THREE.CircleGeometry(1,10);
// const geometry = new THREE.CylinderGeometry( 1, 1, 1, 32 );
// const geometry = new THREE.TorusGeometry( 1, 1, 16 , 100, 1 );
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
scene.add(camera);
// scene.background = new THREE.Color(0xffffff);
console.log('scene', scene)
camera.position.z = 3;
// camera.rotation.y = -0.6
const cursorCoordinate = {
    x: 0,
    y: 0
};
cube.position.x = 0;
cube.position.y = 0;
renderer.setClearColor(0xffffff, 0)
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

    cube.rotation.y += 0.01 * delta / 10;

    // window.requestAnimationFrame(animate)

    // cube.rotation.y += 0.01;
    // cube.rotation.z += 0.01;
    // cube.position.x = Math.sin(clock.getElapsedTime())
    // cube.position.y = Math.cos(clock.getElapsedTime())
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate)


}
// window.requestAnimationFrame(animate);

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
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    // console.log('x - normolise', x);
    // console.log('y - normolise', y);
    const pointer = new THREE.Vector2();
    pointer.x = x;
    pointer.y = y;
    raycaster.setFromCamera(pointer, camera);
    const intersection = raycaster.intersectObject(cube);
    console.log('intersection', intersection);
    console.log(cube)
    if (intersection.length) {
        const [{ object: activeElement }] = intersection;
        console.log('activeElement', activeElement);
        if (activeElementProps !== null) {
            const { activeElement: prevactiveElement, position: startPositionPrevActiveElement } = activeElementProps;
            if (activeElement === prevactiveElement) {
                console.log(true)
                const goBackPrevActiveElementAndStartAnimateNewElement = goBackPrevActiveElementAndStartAnimateNewElementWrapper(prevactiveElement, startPositionPrevActiveElement);
                goBackPrevActiveElementAndStartAnimateNewElement();
            } else {
                const goBackPrevActiveElementAndStartAnimateNewElement = goBackPrevActiveElementAndStartAnimateNewElementWrapper(prevactiveElement, startPositionPrevActiveElement, activeElement);
                goBackPrevActiveElementAndStartAnimateNewElement();
            }
        } else {
            console.log('start animation element')
            setActiveElement(activeElement);
            startAnimationActiveElement();
        }


    } else {
        if (activeElementProps !== null) {
            const { activeElement: prevactiveElement, position: startPositionPrevActiveElement } = activeElementProps;
            const goBackPrevActiveElementAndStartAnimateNewElement = goBackPrevActiveElementAndStartAnimateNewElementWrapper(prevactiveElement, startPositionPrevActiveElement);
            goBackPrevActiveElementAndStartAnimateNewElement();
        }
    }
})


function resetPropsAndSetStartPositionPrevActiveElement(activeElement = activeElementProps.activeElement, position = activeElementProps.position) {
    // const { activeElement, position } = prevActiveElement;
    const { x, y, z } = position;
    console.log('x - ', x, 'y- ', y, z)
    activeElement.material.color.set(0x00ff00);
    activeElement.position.set(x, y, z);
    activeElement.rotation.set(0, 0, 0)
    // activeElementProps = null;
}
//утсанавливает активный элемент
function setActiveElement(element) {
    activeElementProps = { activeElement: element, position: { ...element.position } };
}
// устанавливает анимацию
function startAnimationActiveElement() {
    const rotateElementAndScaleElement = createRotationAndScalingWrapper();
    rotateElementAndScaleElement();
}

function createRotationAndScalingWrapper() {
    // создаем функцию обертку для того чтобы инициализировать начальную точку отсчета времени начала анимации

    let startTime = Date.now();
    return function rotateElementAndScaleElement() {
        const isAvtiveElement = !!activeElementProps;
        if (isAvtiveElement) {
            const z = 2;
            const { activeElement } = activeElementProps;
            const current = Date.now();
            const delta = current - startTime;
            startTime = current;
            activeElement.rotation.x += delta / 1000;
            activeElement.rotation.y += delta / 1000;
            if (activeElement.position.z <= z) {
                activeElement.position.z += delta / 1000;

            }
            renderer.render(scene, camera);
            window.requestAnimationFrame(rotateElementAndScaleElement);
        }

    }
}
function goBackPrevActiveElementAndStartAnimateNewElementWrapper(prevElement, startPositionPrevElement, activeElement = null) {
    let startTime = Date.now();
    const { x, y, z } = startPositionPrevElement;
    activeElementProps = null;// установит текущие свойства в null что даст возможность остановить анимацию
    // createRotationAndScalingWrapper и соотвественно удалит текущий активный элемент.
    // анимация createRotationAndScalingWrapper и соотвественно не будет конфликта с анимацией goBackPrevActiveElementAndStartAnimateNewElement,
    // которая возвращает наш текущий,точнее уже предыдущий активный элемент на его стартовую позицию.
    // После чего будет запушена анимация для активного элемента на котором произошел клик
    return function goBackPrevActiveElementAndStartAnimateNewElement() {
        const currentTime = Date.now();
        const delta = currentTime - startTime;
        startTime = currentTime;
        if (prevElement.position.z > z) {
            prevElement.position.z -= delta / 1000;
            prevElement.rotation.x += delta / 1000;
            prevElement.rotation.y += delta / 1000;
            window.requestAnimationFrame(goBackPrevActiveElementAndStartAnimateNewElement)
        }
        else {
            resetPropsAndSetStartPositionPrevActiveElement(prevElement, startPositionPrevElement);
            activeElement !== null ? (setActiveElement(activeElement), startAnimationActiveElement()) : void 0;
        }
        renderer.render(scene, camera);
    }
}